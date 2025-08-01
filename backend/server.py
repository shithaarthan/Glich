from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from supabase import create_client, Client
from gotrue.types import User
import os


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now - should be configured properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Explicit host and port configuration
import uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise Exception("Please set the SUPABASE_URL and SUPABASE_KEY environment variables.")

supabase: Client = create_client(url, key)

async def get_current_user(request: Request) -> User:
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Not authenticated: Missing Authorization header")

    # The header should be in the format "Bearer <token>"
    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme.")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Authorization header format.")

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        user_response = supabase.auth.get_user(token)
        if user_response.user:
            return user_response.user
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")

@app.get("/api/")
async def read_root():
    return {"message": "Welcome to the backend!"}

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Test endpoint reached!"}

@app.get("/api/profiles")
async def get_profiles():
    try:
        response = supabase.table("profiles").select("*").execute()
        if response.data:
            return {"profiles": response.data}
        else:
            return {"message": "No profiles found"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/auth/google/login")
async def google_login_url():
    try:
        # Use sign_in_with_oauth to get the OAuth URL
        auth_response = supabase.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {
                "redirect_to": f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/auth/callback"
            }
        })
        return JSONResponse({"url": auth_response.url}, media_type="application/json")
    except Exception as e:
        return JSONResponse({"error": str(e)}, media_type="application/json")

@app.get("/api/auth/google/signup")
async def google_signup_url():
    try:
        # Use sign_in_with_oauth to get the OAuth URL (same as login for OAuth)
        auth_response = supabase.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {
                "redirect_to": f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/auth/callback"
            }
        })
        return JSONResponse({"url": auth_response.url}, media_type="application/json")
    except Exception as e:
        return JSONResponse({"error": str(e)})

@app.get("/api/auth/google/callback")
async def google_callback(request: Request):
    try:
        code = request.query_params.get("code")
        if not code:
            raise HTTPException(status_code=400, detail="Authorization code not found in callback.")

        # Exchange the authorization code for a session
        session_response = supabase.auth.exchange_code_for_session({"auth_code": code})

        if session_response.session:
            session = session_response.session
            user = session.user
            
            # First, set the auth cookies regardless of profile status
            from fastapi.responses import RedirectResponse
            
            # Check if a profile already exists for this user
            existing_profile = supabase.table("profiles").select("user_id").eq("user_id", user.id).execute()

            if existing_profile.data:
                # Profile exists, redirect to feed
                redirect_url = f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/feed"
            else:
                # New user, redirect to create profile page
                redirect_url = f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/create-profile"

            response = RedirectResponse(url=redirect_url)
            
            # Set cookies for the session
            response.set_cookie(
                key="sb-access-token", value=session.access_token, httponly=True, samesite="lax",
                secure=False, max_age=session.expires_in
            )
            response.set_cookie(
                key="sb-refresh-token", value=session.refresh_token, httponly=True, samesite="lax",
                secure=False, max_age=604800
            )
            
            return response
        elif session_response.error:
            # Redirect to login page on error
            from fastapi.responses import RedirectResponse
            error_msg = session_response.error.message if hasattr(session_response.error, 'message') else "auth_failed"
            return RedirectResponse(url=f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/login?error={error_msg}")
        else:
            raise HTTPException(status_code=500, detail="Unexpected response from Supabase during OAuth callback.")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        # Redirect to login page on error
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url=f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/login?error=auth_failed")

@app.post("/api/profiles")
async def create_profile(
    user_id: str,
    username: str,
    bio: str = None,
    avatar_url: str = None,
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")
    
    try:
        # Check if a profile already exists for this user_id
        existing_profile_by_user_id = supabase.table("profiles").select("*").eq("user_id", user_id).execute()
        if existing_profile_by_user_id.data:
            raise HTTPException(status_code=409, detail="Profile already exists for this user.")

        # Check if the username is already taken
        existing_profile_by_username = supabase.table("profiles").select("*").eq("username", username).execute()
        if existing_profile_by_username.data:
            raise HTTPException(status_code=409, detail="Username already taken. Please choose a different one.")

        profile_data = {
            "user_id": user_id,
            "username": username,
            "bio": bio,
            "avatar_url": avatar_url
        }
        response = supabase.table("profiles").insert(profile_data).execute()

        if response.data:
            return {"message": "Profile created successfully", "profile": response.data[0]}
        elif response.error:
            raise HTTPException(status_code=400, detail=response.error.get("message", "Error creating profile"))
        else:
            raise HTTPException(status_code=500, detail="Unexpected response from Supabase during profile creation.")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred during profile creation: {str(e)}")

@app.get("/api/profiles/{user_id}")
async def get_profile(user_id: str, current_user_id: str = Depends(get_current_user)):
    # For simplicity, let's allow fetching any profile, but if it were restricted,
    # we'd add a check here like: if user_id != current_user_id: raise HTTPException(status_code=403, detail="Forbidden")
    try:
        response = supabase.table("profiles").select("*").eq("user_id", user_id).execute()
        if response.data:
            return {"profile": response.data[0]}
        else:
            raise HTTPException(status_code=404, detail="Profile not found for this user.")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred while fetching profile: {str(e)}")

@app.put("/api/profiles/{user_id}")
async def update_profile(
    user_id: str,
    username: str = None,
    bio: str = None,
    avatar_url: str = None,
    current_user_id: str = Depends(get_current_user)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")
    
    try:
        update_data = {}
        if username is not None:
            update_data["username"] = username
        if bio is not None:
            update_data["bio"] = bio
        if avatar_url is not None:
            update_data["avatar_url"] = avatar_url

        if not update_data:
            raise HTTPException(status_code=400, detail="No update data provided.")

        response = supabase.table("profiles").update(update_data).eq("user_id", user_id).execute()

        if response.data:
            return {"message": "Profile updated successfully", "profile": response.data[0]}
        elif response.error:
            if "The row with the given key does not exist." in response.error.get("message", ""):
                raise HTTPException(status_code=404, detail="Profile not found for this user.")
            raise HTTPException(status_code=400, detail=response.error.get("message", "Error updating profile"))
        else:
            raise HTTPException(status_code=500, detail="Unexpected response from Supabase during profile update.")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred during profile update: {str(e)}")

@app.post("/api/calls")
async def create_call(
    user_id: str,
    prompt: str,
    current_user_id: str = Depends(get_current_user)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")
    
    try:
        call_data = {
            "user_id": user_id,
            "prompt": prompt
        }
        response = supabase.table("calls").insert(call_data).execute()

        if response.data:
            return {"message": "Call created successfully", "call": response.data[0]}
        elif response.error:
            raise HTTPException(status_code=400, detail=response.error.get("message", "Error creating call"))
        else:
            raise HTTPException(status_code=500, detail="Unexpected response from Supabase during call creation.")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred during call creation: {str(e)}")

@app.get("/api/calls")
async def get_calls(current_user_id: str = Depends(get_current_user)):
    # Assuming calls are only visible to logged-in users
    # If calls are public, this dependency might be removed or adjusted
    try:
        # Fetch calls associated with the current user
        response = supabase.table("calls").select("*").eq("user_id", current_user_id).execute()
        if response.data:
            return {"calls": response.data}
        else:
            return {"message": "No calls found for this user"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/responses")
async def create_response(
    call_id: str,
    user_id: str,
    response_text: str,
    current_user_id: str = Depends(get_current_user)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")
    
    try:
        response_data = {
            "call_id": call_id,
            "user_id": user_id,
            "response_text": response_text
        }
        response = supabase.table("responses").insert(response_data).execute()

        if response.data:
            return {"message": "Response created successfully", "response": response.data[0]}
        elif response.error:
            raise HTTPException(status_code=400, detail=response.error.get("message", "Error creating response"))
        else:
            raise HTTPException(status_code=500, detail="Unexpected response from Supabase during response creation.")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred during response creation: {str(e)}")

@app.get("/api/responses")
async def get_responses(call_id: str = None, user_id: str = None, current_user_id: str = Depends(get_current_user)):
    # If filtering by user_id, ensure it matches the current user
    if user_id and user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")
    
    # If no filters are provided, or if filtering by current_user_id, fetch accordingly
    try:
        query = supabase.table("responses").select("*")
        if call_id:
            query = query.eq("call_id", call_id)
        
        # If user_id is provided and matches current_user_id, filter by it.
        # Otherwise, if user_id is not provided, we might want to fetch responses for the current user.
        # Let's assume for now that if user_id is not specified, we fetch for the current user.
        # If call_id is specified, we fetch responses for that call, potentially filtered by current user.
        
        if user_id: # This will be current_user_id due to the check above
            query = query.eq("user_id", user_id)
        elif not call_id: # If no call_id and no user_id specified, fetch for current user
             query = query.eq("user_id", current_user_id)

        response = query.execute()

        if response.data:
            return {"responses": response.data}
        else:
            return {"message": "No responses found"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/echoes")
async def create_echo(
    call_id: str,
    response_id: str,
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")
    
    try:
        echo_data = {
            "call_id": call_id,
            "response_id": response_id,
            "user_id": user_id
        }
        response = supabase.table("echoes").insert(echo_data).execute()

        if response.data:
            return {"message": "Echo created successfully", "echo": response.data[0]}
        elif response.error:
            raise HTTPException(status_code=400, detail=response.error.get("message", "Error creating echo"))
        else:
            raise HTTPException(status_code=500, detail="Unexpected response from Supabase during echo creation.")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred during echo creation: {str(e)}")

@app.get("/api/echoes")
async def get_echoes(call_id: str = None, response_id: str = None, user_id: str = None, current_user_id: str = Depends(get_current_user)):
    # If user_id is specified and doesn't match current_user_id, forbid access
    if user_id and user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: Cannot view other users' echoes directly")
    
    try:
        query = supabase.table("echoes").select("*")
        if call_id:
            query = query.eq("call_id", call_id)
        if response_id:
            query = query.eq("response_id", response_id)
        
        if user_id:
            query = query.eq("user_id", user_id)

        response = query.execute()

        if response.data:
            return {"echoes": response.data}
        else:
            return {"message": "No echoes found"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/calls/{post_id}/amplify")
async def amplify_call(post_id: str, current_user_id: str = Depends(get_current_user)):
    try:
        # Check if already amplified
        existing_amplify = supabase.table("amplifies").select("*").eq("call_id", post_id).eq("user_id", current_user_id).execute()
        
        if existing_amplify.data:
            # If already amplified, remove amplify (toggle)
            supabase.table("amplifies").delete().eq("call_id", post_id).eq("user_id", current_user_id).execute()
            return {"message": "Amplify removed", "amplified": False}
        else:
            # Add amplify
            amplify_data = {
                "call_id": post_id,
                "user_id": current_user_id
            }
            response = supabase.table("amplifies").insert(amplify_data).execute()
            
            if response.data:
                return {"message": "Call amplified successfully", "amplified": True}
            else:
                raise HTTPException(status_code=400, detail="Failed to amplify call")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during amplify: {str(e)}")

@app.post("/api/calls/{post_id}/bookmark")
async def bookmark_call(post_id: str, current_user_id: str = Depends(get_current_user)):
    try:
        # Check if already bookmarked
        existing_bookmark = supabase.table("bookmarks").select("*").eq("call_id", post_id).eq("user_id", current_user_id).execute()
        
        if existing_bookmark.data:
            # If already bookmarked, remove bookmark (toggle)
            supabase.table("bookmarks").delete().eq("call_id", post_id).eq("user_id", current_user_id).execute()
            return {"message": "Bookmark removed", "bookmarked": False}
        else:
            # Add bookmark
            bookmark_data = {
                "call_id": post_id,
                "user_id": current_user_id
            }
            response = supabase.table("bookmarks").insert(bookmark_data).execute()
            
            if response.data:
                return {"message": "Call bookmarked successfully", "bookmarked": True}
            else:
                raise HTTPException(status_code=400, detail="Failed to bookmark call")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during bookmark: {str(e)}")

@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="sb-access-token")
    response.delete_cookie(key="sb-refresh-token")
    return {"message": "Logout successful"}

@app.get("/api/search")
async def search_content(query: str, current_user_id: str = Depends(get_current_user)):
    try:
        # Search in calls (posts)
        calls_response = supabase.table("calls").select("*").ilike("prompt", f"%{query}%").execute()
        
        # Search in profiles
        profiles_response = supabase.table("profiles").select("*").ilike("username", f"%{query}%").execute()
        
        return {
            "calls": calls_response.data or [],
            "profiles": profiles_response.data or [],
            "query": query
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during search: {str(e)}")

@app.get("/api/calls/{post_id}/interactions")
async def get_call_interactions(post_id: str, current_user_id: str = Depends(get_current_user)):
    try:
        # Get responses count
        responses = supabase.table("responses").select("*").eq("call_id", post_id).execute()
        
        # Get echoes count
        echoes = supabase.table("echoes").select("*").eq("call_id", post_id).execute()
        
        # Get amplifies count
        amplifies = supabase.table("amplifies").select("*").eq("call_id", post_id).execute()
        
        # Get bookmarks count
        bookmarks = supabase.table("bookmarks").select("*").eq("call_id", post_id).execute()
        
        # Check if current user has interacted
        user_amplified = any(amp["user_id"] == current_user_id for amp in (amplifies.data or []))
        user_bookmarked = any(book["user_id"] == current_user_id for book in (bookmarks.data or []))
        user_echoed = any(echo["user_id"] == current_user_id for echo in (echoes.data or []))
        
        return {
            "responses_count": len(responses.data or []),
            "echoes_count": len(echoes.data or []),
            "amplifies_count": len(amplifies.data or []),
            "bookmarks_count": len(bookmarks.data or []),
            "user_amplified": user_amplified,
            "user_bookmarked": user_bookmarked,
            "user_echoed": user_echoed,
            "responses": responses.data or [],
            "echoes": echoes.data or []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred fetching interactions: {str(e)}")

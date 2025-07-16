from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from supabase import create_client, Client
import os


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Explicit host and port configuration
import uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise Exception("Please set the SUPABASE_URL and SUPABASE_KEY environment variables.")

supabase: Client = create_client(url, key)

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Invalid authorization format")

    try:
        user_response = supabase.auth.get_user(token)
        if user_response.user:
            return user_response.user.id
        elif user_response.error:
            raise HTTPException(status_code=401, detail=user_response.error.get("message", "Invalid or expired token"))
        else:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the backend!"}

@app.get("/profiles")
async def get_profiles():
    try:
        response = supabase.table("profiles").select("*").execute()
        if response.data:
            return {"profiles": response.data}
        else:
            return {"message": "No profiles found"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/auth/google/login")
async def google_login_url():
    try:
        auth_url = supabase.auth.get_provider_oauth_url("google")
        return JSONResponse({"url": auth_url}, media_type="application/json")
    except Exception as e:
        return JSONResponse({"error": str(e)}, media_type="application/json")

@app.get("/auth/google/signup")
async def google_signup_url():
    try:
        auth_url = supabase.auth.get_provider_oauth_url("google")
        return JSONResponse({"url": auth_url}, media_type="application/json")
    except Exception as e:
        return JSONResponse({"error": str(e)})

@app.get("/auth/google/callback")
async def google_callback(code: str):
    try:
        response = supabase.auth.exchange_code_for_session(code)
        if response.session:
            return {"message": "Google authentication successful", "session": response.session}
        elif response.error:
            raise HTTPException(status_code=400, detail=response.error.get("message", "Error exchanging code for session"))
        else:
            raise HTTPException(status_code=500, detail="Unexpected response from Supabase during OAuth callback.")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred during OAuth callback: {str(e)}")

@app.post("/profiles")
async def create_profile(
    user_id: str,
    username: str,
    bio: str = None,
    avatar_url: str = None,
    current_user_id: str = Depends(get_current_user)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Forbidden: User ID mismatch")
    
    try:
        existing_profile = supabase.table("profiles").select("*").eq("user_id", user_id).execute()
        if existing_profile.data:
            raise HTTPException(status_code=409, detail="Profile already exists for this user.")

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

@app.get("/profiles/{user_id}")
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

@app.put("/profiles/{user_id}")
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

@app.post("/calls")
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

@app.get("/calls")
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

@app.post("/responses")
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

@app.get("/responses")
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

@app.post("/echoes")
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

@app.get("/echoes")
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

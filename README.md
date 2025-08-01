# Glich - Authentication Flow

This document outlines the authentication and user profile creation flow within the Glich application.

## 1. User Sign-In/Sign-Up Initiation

When a user attempts to sign in (e.g., via Google OAuth):

*   The application initiates the authentication process using Supabase.
*   The user is redirected to the OAuth provider (e.g., Google) for authentication.
*   Upon successful authentication with the provider, the user is redirected back to the application's `AuthCallback` page.

## 2. Authentication Callback (`/auth/callback`)

The `AuthCallback.tsx` component handles the post-authentication logic:

*   **Error Handling**:
    *   If the OAuth provider returns an error (e.g., `error` or `error_description` in the URL parameters), the error is logged.
    *   Specific errors, like "Database error saving new user," will redirect the user to the `/signup` page with a message prompting them to sign up first.
    *   Other generic authentication errors will redirect the user to the `/login` page with an appropriate error message.
*   **Successful Authentication**:
    *   If no errors occur, the application attempts to retrieve the user's session from Supabase.
    *   If a session is successfully obtained, the `authStore` is updated with the session information.
    *   The application then attempts to fetch the user's profile from the `profiles` table in Supabase using their `user.id`.
        *   **Existing User**: If a profile is found, the `authStore` is updated with the user's profile data, and the user is redirected to the `/feed` page.
*   **New User (No Profile)**: If no profile is found (indicated by a `PGRST116` error code from Supabase, meaning "No rows found"), it signifies a new user who has authenticated but not yet created a profile. In this case, the `authStore`'s `hasProfile` state is set to `false`, and the user is redirected to the `/create-profile` page.
    *   If no session is obtained after the callback, the user is redirected to the `/login` page with an authentication failure message.

## 3. Profile Creation (`/create-profile`)

The `/create-profile` page is where users (both newly authenticated and demo users) set up their initial profile.

*   This page allows users to input their username, avatar URL, and bio.
*   **Profile Gate**: If a user is authenticated but `hasProfile` is `false`, they are directed to this page. If they attempt to navigate away (e.g., using the browser's back button) without completing their profile, they will be redirected back to `/create-profile` or `/auth` if not logged in, ensuring the main application is not accessible until a profile is created.
*   **For Authenticated Users**: After submitting the profile, the data is saved to the Supabase `profiles` table, linking it to their authenticated user ID. Upon successful profile creation, the `authStore`'s `hasProfile` state is set to `true`, and the user is redirected to the `/feed` page.
*   **For Demo Mode Users**:
    *   The demo mode allows users to experience the application without full authentication.
    *   When entering demo mode, a mock user profile is set in the `authStore`.
    *   The profile creation process in demo mode does **not** involve Supabase authentication or database interaction. It simply updates the local `authStore` with the demo profile details and sets `hasProfile` to `true`.
    *   After "creating" a profile in demo mode, the user is redirected to the `/feed` page.

## 4. User Experience Summary

*   **Existing User Sign-In**: Sign in -> Auth Callback -> Fetch Profile (profile found, `hasProfile` is `true`) -> Redirect to `/feed`.
*   **New User Sign-Up/Sign-In**: Sign in -> Auth Callback (no profile found, `hasProfile` is `false`) -> Redirect to `/create-profile` -> Create Profile (`hasProfile` set to `true`) -> Redirect to `/feed`.
*   **Profile Creation Interruption**: If a user navigates to `/create-profile` and then tries to go back or to another protected route without completing their profile, they will be redirected back to `/create-profile` or `/auth` if not logged in.
*   **Demo Mode**: Activate Demo Mode -> (Optional) Create Demo Profile (`hasProfile` set to `true`) -> Redirect to `/feed`.

This flow ensures that all users, whether authenticated or in demo mode, have a profile before accessing the main application feed, providing a consistent and secure user experience.

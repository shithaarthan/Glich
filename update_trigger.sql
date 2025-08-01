-- Drop the trigger and function to disable automatic profile creation.
-- This ensures that the manual profile creation flow is the only one active.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user();

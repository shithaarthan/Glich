-- schema.sql

-- Profiles Table
-- Stores user profile information.
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL CHECK (char_length(username) > 3),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Calls Table
-- Stores the main posts or "calls" from users.
CREATE TABLE IF NOT EXISTS public.calls (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Responses Table
-- Stores responses to a specific call.
CREATE TABLE IF NOT EXISTS public.responses (
    id BIGSERIAL PRIMARY KEY,
    call_id BIGINT NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Echoes Table
-- Represents a user "echoing" or sharing a response.
CREATE TABLE IF NOT EXISTS public.echoes (
    id BIGSERIAL PRIMARY KEY,
    call_id BIGINT NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
    response_id BIGINT NOT NULL REFERENCES public.responses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(response_id, user_id) -- A user can only echo a response once.
);

-- Amplifies Table
-- Represents a user "amplifying" or liking a call.
CREATE TABLE IF NOT EXISTS public.amplifies (
    id BIGSERIAL PRIMARY KEY,
    call_id BIGINT NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(call_id, user_id) -- A user can only amplify a call once.
);

-- Bookmarks Table
-- Stores user bookmarks of calls.
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id BIGSERIAL PRIMARY KEY,
    call_id BIGINT NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(call_id, user_id) -- A user can only bookmark a call once.
);

-- Enable Row-Level Security (RLS) for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.echoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amplifies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Users can see all profiles.
CREATE POLICY "Allow all users to read profiles" ON public.profiles FOR SELECT USING (true);
-- Users can only insert their own profile.
CREATE POLICY "Allow user to insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users can only update their own profile.
CREATE POLICY "Allow user to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for calls
-- Logged-in users can see all calls.
CREATE POLICY "Allow authenticated users to read calls" ON public.calls FOR SELECT USING (auth.role() = 'authenticated');
-- Users can only insert calls for themselves.
CREATE POLICY "Allow user to create their own calls" ON public.calls FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users can only delete their own calls.
CREATE POLICY "Allow user to delete their own calls" ON public.calls FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for other tables (responses, echoes, amplifies, bookmarks)
-- Allow full access for authenticated users, constrained to their own user_id where applicable.
CREATE POLICY "Allow authenticated users to read all" ON public.responses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow user to create their own" ON public.responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user to delete their own" ON public.responses FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to read all" ON public.echoes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow user to create their own" ON public.echoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user to delete their own" ON public.echoes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to read all" ON public.amplifies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow user to create their own" ON public.amplifies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user to delete their own" ON public.amplifies FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to read all" ON public.bookmarks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow user to create their own" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow user to delete their own" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

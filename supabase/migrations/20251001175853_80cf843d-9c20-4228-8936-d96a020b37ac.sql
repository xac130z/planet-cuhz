-- Drop existing overly permissive policies on twitch_users
DROP POLICY IF EXISTS "Admins can view all tokens" ON public.twitch_users;
DROP POLICY IF EXISTS "No client access to twitch tokens" ON public.twitch_users;
DROP POLICY IF EXISTS "No direct deletion of twitch tokens" ON public.twitch_users;
DROP POLICY IF EXISTS "No direct modification of twitch tokens" ON public.twitch_users;
DROP POLICY IF EXISTS "No direct updates of twitch tokens" ON public.twitch_users;
DROP POLICY IF EXISTS "Service role can manage all twitch tokens" ON public.twitch_users;
DROP POLICY IF EXISTS "Service role can manage twitch tokens" ON public.twitch_users;
DROP POLICY IF EXISTS "Users can view their own tokens" ON public.twitch_users;
DROP POLICY IF EXISTS "Users can view their own twitch tokens" ON public.twitch_users;

-- Enable RLS if not already enabled
ALTER TABLE public.twitch_users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own Twitch data (linked via user_profiles.twitch_name)
CREATE POLICY "Users can view their own twitch data"
ON public.twitch_users
FOR SELECT
TO authenticated
USING (
  login IN (
    SELECT twitch_name
    FROM public.user_profiles
    WHERE user_id = auth.uid()
  )
);

-- Policy 2: Service role can manage all twitch_users (for OAuth flow)
CREATE POLICY "Service role manages twitch users"
ON public.twitch_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 3: Block all direct client-side INSERT operations
CREATE POLICY "No direct client insert of twitch users"
ON public.twitch_users
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Policy 4: Block all direct client-side UPDATE operations
CREATE POLICY "No direct client update of twitch users"
ON public.twitch_users
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Policy 5: Block all direct client-side DELETE operations
CREATE POLICY "No direct client delete of twitch users"
ON public.twitch_users
FOR DELETE
TO authenticated
USING (false);

-- Policy 6: Block all anonymous access
CREATE POLICY "No anonymous access to twitch users"
ON public.twitch_users
FOR ALL
TO anon
USING (false)
WITH CHECK (false);
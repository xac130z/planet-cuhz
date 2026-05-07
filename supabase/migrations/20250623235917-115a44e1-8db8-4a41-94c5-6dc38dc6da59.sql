
-- Clean up duplicate RLS policies more carefully
-- First check what policies exist and drop only the duplicates

-- Drop any policies that might be duplicates on token_transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.token_transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.token_transactions;

-- Only create token_transactions policies if they don't exist
-- The error suggests "Users can view their own token transactions" already exists, so skip it

-- Create the insert policy only if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'token_transactions' 
        AND policyname = 'Users can insert their own token transactions'
    ) THEN
        CREATE POLICY "Users can insert their own token transactions" 
          ON public.token_transactions 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- Update swipes policies - drop and recreate safely
DROP POLICY IF EXISTS "Users can view their own swipes" ON public.swipes;
DROP POLICY IF EXISTS "Users can create their own swipes" ON public.swipes;

CREATE POLICY "Users can view their own swipes" 
  ON public.swipes
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = swiper_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own swipes" 
  ON public.swipes
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = swiper_id AND user_id = auth.uid()
    )
  );

-- Update matches policies - drop and recreate safely
DROP POLICY IF EXISTS "Users can view their matches" ON public.matches;
DROP POLICY IF EXISTS "Users can update their matches" ON public.matches;

CREATE POLICY "Users can view their matches" 
  ON public.matches
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up1
      WHERE up1.id = user1_id AND up1.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up2
      WHERE up2.id = user2_id AND up2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their matches" 
  ON public.matches
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up1
      WHERE up1.id = user1_id AND up1.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles up2
      WHERE up2.id = user2_id AND up2.user_id = auth.uid()
    )
  );

-- Update messages policies - drop and recreate safely  
DROP POLICY IF EXISTS "Users can view messages in their matches" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their matches" ON public.messages;

CREATE POLICY "Users can view messages in their matches" 
  ON public.messages
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.user_profiles up1 ON up1.id = m.user1_id
      JOIN public.user_profiles up2 ON up2.id = m.user2_id
      WHERE m.id = messages.match_id 
      AND (up1.user_id = auth.uid() OR up2.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their matches" 
  ON public.messages
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = sender_id AND up.user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.user_profiles up1 ON up1.id = m.user1_id
      JOIN public.user_profiles up2 ON up2.id = m.user2_id
      WHERE m.id = messages.match_id 
      AND (up1.user_id = auth.uid() OR up2.user_id = auth.uid())
    )
  );


-- Phase 1: Emergency RLS Policy Implementation

-- First, ensure RLS is enabled on all tables (some may already be enabled)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own swipes" ON public.swipes;
DROP POLICY IF EXISTS "Users can create their own swipes" ON public.swipes;
DROP POLICY IF EXISTS "Users can view their matches" ON public.matches;
DROP POLICY IF EXISTS "Users can update their matches" ON public.matches;
DROP POLICY IF EXISTS "Users can view messages in their matches" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their matches" ON public.messages;

-- Comprehensive RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
  ON public.user_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for swipes - users can only access their own swipe data
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

-- RLS policies for matches - users can only see matches they're part of
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

-- RLS policies for messages - users can only access messages from their matches
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

-- RLS policies for token_transactions - users can only see their own transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.token_transactions
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
  ON public.token_transactions
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

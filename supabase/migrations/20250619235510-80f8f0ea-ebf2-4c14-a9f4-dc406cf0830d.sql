
-- Create swipes table to track user swipe actions
CREATE TABLE public.swipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  swiped_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'super_like')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(swiper_id, swiped_id)
);

-- Create matches table for mutual likes
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'deleted')),
  compatibility_score DECIMAL(3,2) DEFAULT 0.5,
  keyword_score INTEGER DEFAULT 0,
  numerology_score INTEGER DEFAULT 0,
  zodiac_score INTEGER DEFAULT 0,
  moon_phase_score INTEGER DEFAULT 0,
  user_type_score INTEGER DEFAULT 0,
  compatibility_insights JSONB DEFAULT '{}',
  matched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create messages table for chat functionality
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'sticker')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for swipes
CREATE POLICY "Users can view their own swipes" ON public.swipes
  FOR SELECT USING (auth.uid()::text = swiper_id::text);

CREATE POLICY "Users can create their own swipes" ON public.swipes
  FOR INSERT WITH CHECK (auth.uid()::text = swiper_id::text);

-- RLS Policies for matches
CREATE POLICY "Users can view their matches" ON public.matches
  FOR SELECT USING (auth.uid()::text = user1_id::text OR auth.uid()::text = user2_id::text);

CREATE POLICY "Users can update their matches" ON public.matches
  FOR UPDATE USING (auth.uid()::text = user1_id::text OR auth.uid()::text = user2_id::text);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their matches" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE matches.id = messages.match_id 
      AND (matches.user1_id::text = auth.uid()::text OR matches.user2_id::text = auth.uid()::text)
    )
  );

CREATE POLICY "Users can send messages in their matches" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid()::text = sender_id::text AND
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE matches.id = messages.match_id 
      AND (matches.user1_id::text = auth.uid()::text OR matches.user2_id::text = auth.uid()::text)
    )
  );

-- Add updated_at trigger for matches
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for matches and messages
ALTER TABLE public.matches REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

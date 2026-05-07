
-- Phase 1: Core Tables Creation

-- 1. Commands Table (Enhanced)
CREATE TABLE public.commands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending',
  vote_count INTEGER NOT NULL DEFAULT 0,
  energy INTEGER NOT NULL DEFAULT 0,
  ai_review JSONB DEFAULT '{}'::jsonb,
  submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_category CHECK (category IN ('tools', 'partnerships', 'lore', 'governance', 'general')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'implemented'))
);

-- 2. Votes Table (Optimized)
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  command_id UUID NOT NULL REFERENCES public.commands(id) ON DELETE CASCADE,
  vote_weight INTEGER NOT NULL DEFAULT 1,
  vote_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_command_vote UNIQUE (user_profile_id, command_id),
  CONSTRAINT valid_vote_weight CHECK (vote_weight BETWEEN 1 AND 10)
);

-- 3. Game Logs Table
CREATE TABLE public.game_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL DEFAULT 'spaceship',
  score INTEGER NOT NULL DEFAULT 0,
  won BOOLEAN NOT NULL DEFAULT false,
  duration_seconds INTEGER,
  bonus_command_earned BOOLEAN NOT NULL DEFAULT false,
  play_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_game_type CHECK (game_type IN ('spaceship', 'puzzle', 'trivia', 'memory')),
  CONSTRAINT valid_score CHECK (score >= 0)
);

-- 4. Daily Limits Table
CREATE TABLE public.daily_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_profile_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  limit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  commands_submitted INTEGER NOT NULL DEFAULT 0,
  votes_cast INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  bonus_commands_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_user_date UNIQUE (user_profile_id, limit_date),
  CONSTRAINT valid_counts CHECK (
    commands_submitted >= 0 AND 
    votes_cast >= 0 AND 
    games_played >= 0 AND 
    bonus_commands_earned >= 0
  )
);

-- Phase 2: Security & Performance

-- Enable RLS on all tables
ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Commands
CREATE POLICY "Anyone can view commands" 
  ON public.commands 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own commands" 
  ON public.commands 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own commands" 
  ON public.commands 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_profile_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for Votes
CREATE POLICY "Users can view votes on commands" 
  ON public.votes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own votes" 
  ON public.votes 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own votes" 
  ON public.votes 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_profile_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for Game Logs
CREATE POLICY "Users can view their own game logs" 
  ON public.game_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own game logs" 
  ON public.game_logs 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_profile_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for Daily Limits
CREATE POLICY "Users can view their own daily limits" 
  ON public.daily_limits 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own daily limits" 
  ON public.daily_limits 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = user_profile_id AND user_id = auth.uid()
    )
  );

-- Performance Indexes
CREATE INDEX idx_commands_submission_date ON public.commands(submission_date);
CREATE INDEX idx_commands_status ON public.commands(status);
CREATE INDEX idx_commands_category ON public.commands(category);
CREATE INDEX idx_commands_user_profile ON public.commands(user_profile_id);

CREATE INDEX idx_votes_vote_date ON public.votes(vote_date);
CREATE INDEX idx_votes_command ON public.votes(command_id);
CREATE INDEX idx_votes_user_profile ON public.votes(user_profile_id);

CREATE INDEX idx_game_logs_play_date ON public.game_logs(play_date);
CREATE INDEX idx_game_logs_user_profile ON public.game_logs(user_profile_id);
CREATE INDEX idx_game_logs_game_type ON public.game_logs(game_type);

CREATE INDEX idx_daily_limits_date ON public.daily_limits(limit_date);
CREATE INDEX idx_daily_limits_user_profile ON public.daily_limits(user_profile_id);

-- Phase 3: Helper Functions

-- Function to check daily command submission limit
CREATE OR REPLACE FUNCTION public.check_daily_command_limit(p_user_profile_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT commands_submitted FROM public.daily_limits 
     WHERE user_profile_id = p_user_profile_id AND limit_date = p_date),
    0
  ) < 3; -- Max 3 commands per day
$$;

-- Function to check daily vote limit  
CREATE OR REPLACE FUNCTION public.check_daily_vote_limit(p_user_profile_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT votes_cast FROM public.daily_limits 
     WHERE user_profile_id = p_user_profile_id AND limit_date = p_date),
    0
  ) < 10; -- Max 10 votes per day
$$;

-- Function to update vote count on commands
CREATE OR REPLACE FUNCTION public.update_vote_count()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.commands 
    SET vote_count = vote_count + NEW.vote_weight,
        updated_at = now()
    WHERE id = NEW.command_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.commands 
    SET vote_count = vote_count - OLD.vote_weight,
        updated_at = now()
    WHERE id = OLD.command_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.commands 
    SET vote_count = vote_count - OLD.vote_weight + NEW.vote_weight,
        updated_at = now()
    WHERE id = NEW.command_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Function to manage daily limits
CREATE OR REPLACE FUNCTION public.update_daily_limits()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  limit_date DATE;
  column_to_update TEXT;
BEGIN
  -- Determine which table and date we're working with
  IF TG_TABLE_NAME = 'commands' THEN
    limit_date := NEW.submission_date;
    column_to_update := 'commands_submitted';
  ELSIF TG_TABLE_NAME = 'votes' THEN
    limit_date := NEW.vote_date;
    column_to_update := 'votes_cast';
  ELSIF TG_TABLE_NAME = 'game_logs' THEN
    limit_date := NEW.play_date;
    column_to_update := 'games_played';
  END IF;

  -- Insert or update daily limits record
  INSERT INTO public.daily_limits (user_profile_id, limit_date, commands_submitted, votes_cast, games_played)
  VALUES (NEW.user_profile_id, limit_date, 
    CASE WHEN column_to_update = 'commands_submitted' THEN 1 ELSE 0 END,
    CASE WHEN column_to_update = 'votes_cast' THEN 1 ELSE 0 END,
    CASE WHEN column_to_update = 'games_played' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_profile_id, limit_date)
  DO UPDATE SET
    commands_submitted = CASE WHEN column_to_update = 'commands_submitted' 
      THEN daily_limits.commands_submitted + 1 
      ELSE daily_limits.commands_submitted END,
    votes_cast = CASE WHEN column_to_update = 'votes_cast' 
      THEN daily_limits.votes_cast + 1 
      ELSE daily_limits.votes_cast END,
    games_played = CASE WHEN column_to_update = 'games_played' 
      THEN daily_limits.games_played + 1 
      ELSE daily_limits.games_played END,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Phase 4: Triggers & Automation

-- Trigger to update vote counts
CREATE TRIGGER trigger_update_vote_count
  AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_vote_count();

-- Triggers to update daily limits
CREATE TRIGGER trigger_commands_daily_limits
  AFTER INSERT ON public.commands
  FOR EACH ROW EXECUTE FUNCTION public.update_daily_limits();

CREATE TRIGGER trigger_votes_daily_limits
  AFTER INSERT ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_daily_limits();

CREATE TRIGGER trigger_game_logs_daily_limits
  AFTER INSERT ON public.game_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_daily_limits();

-- Triggers to update timestamps
CREATE TRIGGER trigger_commands_updated_at
  BEFORE UPDATE ON public.commands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_daily_limits_updated_at
  BEFORE UPDATE ON public.daily_limits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

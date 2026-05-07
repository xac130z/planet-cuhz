-- Fix basic functions that don't depend on views

-- Fix check_daily_command_limit function
CREATE OR REPLACE FUNCTION public.check_daily_command_limit(p_user_profile_id uuid, p_date date DEFAULT CURRENT_DATE)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT COALESCE(
    (SELECT commands_submitted FROM public.daily_limits 
     WHERE user_profile_id = p_user_profile_id AND limit_date = p_date),
    0
  ) < 3; -- Max 3 commands per day
$function$;

-- Fix check_daily_vote_limit function
CREATE OR REPLACE FUNCTION public.check_daily_vote_limit(p_user_profile_id uuid, p_date date DEFAULT CURRENT_DATE)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
  SELECT COALESCE(
    (SELECT votes_cast FROM public.daily_limits 
     WHERE user_profile_id = p_user_profile_id AND limit_date = p_date),
    0
  ) < 10; -- Max 10 votes per day
$function$;

-- Fix update_vote_count function
CREATE OR REPLACE FUNCTION public.update_vote_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- Fix update_daily_limits function
CREATE OR REPLACE FUNCTION public.update_daily_limits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

-- Fix get_or_create_user_profile_by_wallet function
CREATE OR REPLACE FUNCTION public.get_or_create_user_profile_by_wallet(p_wallet_address text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    profile_id UUID;
BEGIN
    -- Try to find existing profile by wallet address
    SELECT id INTO profile_id
    FROM public.user_profiles
    WHERE user_id = p_wallet_address;
    
    -- If no profile exists, create one
    IF profile_id IS NULL THEN
        INSERT INTO public.user_profiles (
            id,
            user_id,
            display_name,
            onboarding_completed
        ) VALUES (
            gen_random_uuid(),
            p_wallet_address,
            CONCAT('Wallet User ', SUBSTRING(p_wallet_address, 1, 8)),
            false
        ) RETURNING id INTO profile_id;
    END IF;
    
    RETURN profile_id;
END;
$function$;

-- Fix check_daily_command_limit_by_wallet function
CREATE OR REPLACE FUNCTION public.check_daily_command_limit_by_wallet(p_wallet_address text, p_date date DEFAULT CURRENT_DATE)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    profile_id UUID;
    commands_count INTEGER;
BEGIN
    -- Get or create user profile
    profile_id := public.get_or_create_user_profile_by_wallet(p_wallet_address);
    
    -- Check command count for today
    SELECT COALESCE(commands_submitted, 0) INTO commands_count
    FROM public.daily_limits 
    WHERE user_profile_id = profile_id AND limit_date = p_date;
    
    -- Return true if under limit (max 3 commands per day)
    RETURN COALESCE(commands_count, 0) < 3;
END;
$function$;
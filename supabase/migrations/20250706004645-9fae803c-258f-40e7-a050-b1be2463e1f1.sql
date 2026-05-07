-- Fix security vulnerabilities by setting explicit search paths on all functions

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

-- Fix get_wallet_leaderboard function
CREATE OR REPLACE FUNCTION public.get_wallet_leaderboard(limit_count integer DEFAULT 10)
 RETURNS TABLE(wallet_address text, total_commands bigint, total_votes_received bigint, avg_votes_per_command numeric, rank integer)
 LANGUAGE sql
 STABLE
 SET search_path = ''
AS $function$
    SELECT 
        ws.wallet_address,
        ws.total_commands,
        ws.total_votes_received,
        ws.avg_votes_per_command,
        ROW_NUMBER() OVER (ORDER BY ws.total_votes_received DESC, ws.total_commands DESC)::INTEGER as rank
    FROM wallet_stats ws
    ORDER BY ws.total_votes_received DESC, ws.total_commands DESC
    LIMIT limit_count;
$function$;

-- Fix get_wallet_achievements function
CREATE OR REPLACE FUNCTION public.get_wallet_achievements(p_wallet_address text)
 RETURNS TABLE(achievement_name text, achievement_description text, unlocked_at timestamp with time zone, achievement_type text)
 LANGUAGE plpgsql
 STABLE
 SET search_path = ''
AS $function$
DECLARE
    stats RECORD;
    game_stats RECORD;
BEGIN
    -- Get wallet stats
    SELECT * INTO stats FROM wallet_stats WHERE wallet_address = p_wallet_address;
    SELECT * INTO game_stats FROM wallet_game_stats WHERE wallet_address = p_wallet_address;
    
    -- First Command achievement
    IF stats.total_commands >= 1 THEN
        RETURN QUERY SELECT 
            'First Command'::TEXT,
            'Submitted your first command to the ecosystem'::TEXT,
            stats.first_command_date,
            'command'::TEXT;
    END IF;
    
    -- Command Creator achievements
    IF stats.total_commands >= 5 THEN
        RETURN QUERY SELECT 
            'Command Creator'::TEXT,
            'Submitted 5 commands'::TEXT,
            stats.first_command_date + INTERVAL '1 day',
            'command'::TEXT;
    END IF;
    
    IF stats.total_commands >= 10 THEN
        RETURN QUERY SELECT 
            'Command Master'::TEXT,
            'Submitted 10 commands'::TEXT,
            stats.first_command_date + INTERVAL '2 days',
            'command'::TEXT;
    END IF;
    
    -- Vote achievements
    IF stats.total_votes_received >= 10 THEN
        RETURN QUERY SELECT 
            'Community Favorite'::TEXT,
            'Received 10+ votes on your commands'::TEXT,
            stats.first_command_date + INTERVAL '3 days',
            'social'::TEXT;
    END IF;
    
    IF stats.total_votes_received >= 50 THEN
        RETURN QUERY SELECT 
            'Rising Star'::TEXT,
            'Received 50+ votes on your commands'::TEXT,
            stats.first_command_date + INTERVAL '7 days',
            'social'::TEXT;
    END IF;
    
    -- Consistency achievements
    IF stats.commands_last_7_days >= 3 THEN
        RETURN QUERY SELECT 
            'Weekly Contributor'::TEXT,
            'Submitted 3+ commands this week'::TEXT,
            CURRENT_TIMESTAMP,
            'consistency'::TEXT;
    END IF;
    
    -- Game achievements
    IF game_stats.total_games >= 1 THEN
        RETURN QUERY SELECT 
            'Space Explorer'::TEXT,
            'Played your first cosmic mission'::TEXT,
            CURRENT_TIMESTAMP,
            'game'::TEXT;
    END IF;
    
    IF game_stats.games_won >= 1 THEN
        RETURN QUERY SELECT 
            'Mission Complete'::TEXT,
            'Successfully completed a cosmic mission'::TEXT,
            CURRENT_TIMESTAMP,
            'game'::TEXT;
    END IF;
    
    IF game_stats.games_won >= 5 THEN
        RETURN QUERY SELECT 
            'Cosmic Pilot'::TEXT,
            'Completed 5 cosmic missions'::TEXT,
            CURRENT_TIMESTAMP,
            'game'::TEXT;
    END IF;
END;
$function$;

-- Fix get_wallet_activity_chart function
CREATE OR REPLACE FUNCTION public.get_wallet_activity_chart(p_wallet_address text, days_back integer DEFAULT 30)
 RETURNS TABLE(activity_date date, commands_count bigint, votes_received bigint, games_played bigint)
 LANGUAGE sql
 STABLE
 SET search_path = ''
AS $function$
    WITH date_series AS (
        SELECT generate_series(
            CURRENT_DATE - INTERVAL '1 day' * days_back,
            CURRENT_DATE,
            '1 day'::interval
        )::date AS activity_date
    ),
    daily_commands AS (
        SELECT 
            c.created_at::date as activity_date,
            COUNT(*) as commands_count,
            SUM(c.vote_count) as votes_received
        FROM commands c
        WHERE c.wallet_address = p_wallet_address
            AND c.created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
        GROUP BY c.created_at::date
    ),
    daily_games AS (
        SELECT 
            gl.created_at::date as activity_date,
            COUNT(*) as games_played
        FROM game_logs gl
        JOIN user_profiles up ON gl.user_profile_id = up.id
        WHERE up.user_id::text = p_wallet_address
            AND gl.created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
        GROUP BY gl.created_at::date
    )
    SELECT 
        ds.activity_date,
        COALESCE(dc.commands_count, 0) as commands_count,
        COALESCE(dc.votes_received, 0) as votes_received,
        COALESCE(dg.games_played, 0) as games_played
    FROM date_series ds
    LEFT JOIN daily_commands dc ON ds.activity_date = dc.activity_date
    LEFT JOIN daily_games dg ON ds.activity_date = dg.activity_date
    ORDER BY ds.activity_date;
$function$;
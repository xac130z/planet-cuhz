-- Fix functions that depend on views - these may need to be recreated after views exist

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
    FROM public.wallet_stats ws
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
    SELECT * INTO stats FROM public.wallet_stats WHERE wallet_address = p_wallet_address;
    SELECT * INTO game_stats FROM public.wallet_game_stats WHERE wallet_address = p_wallet_address;
    
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
        FROM public.commands c
        WHERE c.wallet_address = p_wallet_address
            AND c.created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
        GROUP BY c.created_at::date
    ),
    daily_games AS (
        SELECT 
            gl.created_at::date as activity_date,
            COUNT(*) as games_played
        FROM public.game_logs gl
        JOIN public.user_profiles up ON gl.user_profile_id = up.id
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

-- Create view for wallet statistics
CREATE OR REPLACE VIEW wallet_stats AS
SELECT 
    c.wallet_address,
    COUNT(c.id) as total_commands,
    SUM(c.vote_count) as total_votes_received,
    AVG(c.vote_count) as avg_votes_per_command,
    COUNT(CASE WHEN c.status = 'approved' THEN 1 END) as approved_commands,
    COUNT(CASE WHEN c.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as commands_last_7_days,
    COUNT(CASE WHEN c.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as commands_last_30_days,
    MAX(c.created_at) as last_command_date,
    MIN(c.created_at) as first_command_date
FROM commands c
WHERE c.wallet_address IS NOT NULL
GROUP BY c.wallet_address;

-- Create view for game statistics by wallet (fixed type casting)
CREATE OR REPLACE VIEW wallet_game_stats AS
SELECT 
    up.user_id::text as wallet_address,
    COUNT(gl.id) as total_games,
    COUNT(CASE WHEN gl.won = true THEN 1 END) as games_won,
    AVG(gl.score) as avg_score,
    MAX(gl.score) as best_score,
    SUM(CASE WHEN gl.bonus_command_earned = true THEN 1 END) as bonus_commands_earned
FROM game_logs gl
JOIN user_profiles up ON gl.user_profile_id = up.id
WHERE up.user_id IS NOT NULL
GROUP BY up.user_id;

-- Create leaderboard function
CREATE OR REPLACE FUNCTION get_wallet_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    wallet_address TEXT,
    total_commands BIGINT,
    total_votes_received BIGINT,
    avg_votes_per_command NUMERIC,
    rank INTEGER
) 
LANGUAGE sql
STABLE
AS $$
    SELECT 
        ws.wallet_address,
        ws.total_commands,
        ws.total_votes_received,
        ws.avg_votes_per_command,
        ROW_NUMBER() OVER (ORDER BY ws.total_votes_received DESC, ws.total_commands DESC)::INTEGER as rank
    FROM wallet_stats ws
    ORDER BY ws.total_votes_received DESC, ws.total_commands DESC
    LIMIT limit_count;
$$;

-- Create function to get achievements for a wallet
CREATE OR REPLACE FUNCTION get_wallet_achievements(p_wallet_address TEXT)
RETURNS TABLE (
    achievement_name TEXT,
    achievement_description TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    achievement_type TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
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
$$;

-- Create function for activity chart data (fixed type casting)
CREATE OR REPLACE FUNCTION get_wallet_activity_chart(p_wallet_address TEXT, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    activity_date DATE,
    commands_count BIGINT,
    votes_received BIGINT,
    games_played BIGINT
)
LANGUAGE sql
STABLE
AS $$
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
$$;

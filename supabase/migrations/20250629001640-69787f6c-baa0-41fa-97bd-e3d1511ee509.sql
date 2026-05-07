
-- Add wallet columns to commands table
ALTER TABLE public.commands 
ADD COLUMN wallet_address TEXT,
ADD COLUMN tx_signature TEXT,
ADD COLUMN wallet_verified BOOLEAN DEFAULT false;

-- Create index for faster wallet-based queries
CREATE INDEX idx_commands_wallet_address ON public.commands(wallet_address);

-- Update the daily limits check function to work with wallet addresses
CREATE OR REPLACE FUNCTION public.get_or_create_user_profile_by_wallet(p_wallet_address TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Update daily command limit check to work with wallet addresses
CREATE OR REPLACE FUNCTION public.check_daily_command_limit_by_wallet(p_wallet_address TEXT, p_date DATE DEFAULT CURRENT_DATE)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

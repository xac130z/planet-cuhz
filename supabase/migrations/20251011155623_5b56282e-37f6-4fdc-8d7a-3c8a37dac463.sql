-- Archive governance/crypto/wallet tables safely (with cleanup)
-- Step 1: Create archive schema if not exists
CREATE SCHEMA IF NOT EXISTS archive;

-- Step 2: Drop existing archive tables if they exist
DROP TABLE IF EXISTS archive.commands CASCADE;
DROP TABLE IF EXISTS archive.votes CASCADE;
DROP TABLE IF EXISTS archive.wallet_verifications CASCADE;
DROP TABLE IF EXISTS archive.daily_limits CASCADE;

-- Step 3: Backup actual tables to archive schema
CREATE TABLE archive.commands AS SELECT * FROM public.commands;
CREATE TABLE archive.votes AS SELECT * FROM public.votes;
CREATE TABLE archive.wallet_verifications AS SELECT * FROM public.wallet_verifications;
CREATE TABLE archive.daily_limits AS SELECT * FROM public.daily_limits;

-- Step 4: Drop views first (they depend on tables)
DROP VIEW IF EXISTS public.wallet_stats CASCADE;
DROP VIEW IF EXISTS public.wallet_game_stats CASCADE;

-- Step 5: Drop related functions
DROP FUNCTION IF EXISTS public.get_wallet_achievements(text) CASCADE;
DROP FUNCTION IF EXISTS public.check_daily_command_limit(uuid, date) CASCADE;
DROP FUNCTION IF EXISTS public.check_daily_command_limit_by_wallet(text, date) CASCADE;
DROP FUNCTION IF EXISTS public.check_daily_vote_limit(uuid, date) CASCADE;
DROP FUNCTION IF EXISTS public.get_or_create_user_profile_by_wallet(text) CASCADE;
DROP FUNCTION IF EXISTS public.get_wallet_leaderboard(integer) CASCADE;
DROP FUNCTION IF EXISTS public.get_wallet_activity_chart(text, integer) CASCADE;
DROP FUNCTION IF EXISTS public.verify_wallet_ownership(text) CASCADE;
DROP FUNCTION IF EXISTS public.update_vote_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_daily_limits() CASCADE;
DROP FUNCTION IF EXISTS public.log_wallet_verification() CASCADE;

-- Step 6: Drop the public tables (data is now safely in archive schema)
DROP TABLE IF EXISTS public.commands CASCADE;
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.wallet_verifications CASCADE;
DROP TABLE IF EXISTS public.daily_limits CASCADE;

-- Step 7: Clean up test tables
DROP TABLE IF EXISTS public.test_table CASCADE;
DROP TABLE IF EXISTS public.test_channel CASCADE;
-- Fix missing UPDATE policies for critical tables

-- 1. protocol_profiles: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON protocol_profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 2. lfg_listings: Allow owners to update their listings
CREATE POLICY "Owners can update listings"
ON lfg_listings FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 3. bookings: Allow parties to update status/notes
CREATE POLICY "Parties can update bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = buyer_id OR auth.uid() = player_id)
WITH CHECK (auth.uid() = buyer_id OR auth.uid() = player_id);

-- 4. Add validation for protocol_profiles JSON structure
CREATE OR REPLACE FUNCTION validate_protocol_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.profile IS NULL THEN
    RAISE EXCEPTION 'profile cannot be null';
  END IF;
  
  -- Check for required top-level keys
  IF NOT (NEW.profile ? 'global' AND NEW.profile ? 'nba2k') THEN
    RAISE EXCEPTION 'profile must contain global and nba2k keys';
  END IF;
  
  -- Size limit: 50KB max
  IF octet_length(NEW.profile::text) > 50000 THEN
    RAISE EXCEPTION 'profile exceeds maximum size of 50KB';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER validate_profile_before_insert
BEFORE INSERT OR UPDATE ON protocol_profiles
FOR EACH ROW EXECUTE FUNCTION validate_protocol_profile();
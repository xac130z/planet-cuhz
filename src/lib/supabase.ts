
import { createClient } from "@supabase/supabase-js";

// Use the hardcoded Supabase project URL and anon key for Lovable environment.
const SUPABASE_URL = "https://wjebryxdefcgsxsqomac.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqZWJyeXhkZWZjZ3N4c3FvbWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMTAyMTIsImV4cCI6MjA2NTU4NjIxMn0.o4e8h0oIHqMtVBBhEU3KQMRRvwCc2PpbjSbvqvGm1_o";

// Create a single Supabase client for your app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

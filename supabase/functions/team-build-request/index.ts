import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const TeamBuildRequestSchema = z.object({
  desired_roles: z.array(z.string()).min(1, { message: 'At least one role required' }),
  skill_tiers: z.array(z.string()).min(1, { message: 'At least one skill tier required' }),
  region: z.string().min(1, { message: 'Region required' }),
  platform: z.string().min(1, { message: 'Platform required' }),
  availability_windows: z.array(z.string()).min(1, { message: 'At least one availability window required' }),
  discord_psn: z.string().min(1, { message: 'Discord/PSN required' }).max(500),
  budget_notes: z.string().max(1000).optional(),
  deadline: z.string().datetime({ message: 'Invalid deadline format' }),
});

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input with Zod
    const requestBody = await req.json();
    const validationResult = TeamBuildRequestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.format() }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const {
      desired_roles,
      skill_tiers,
      region,
      platform,
      availability_windows,
      discord_psn,
      budget_notes,
      deadline,
    } = validationResult.data;

    // Insert team build request
    const { data, error } = await supabaseClient
      .from('team_builds')
      .insert({
        buyer_id: user.id,
        desired_roles,
        skill_tiers,
        region,
        platform,
        availability_windows,
        discord_psn,
        budget_notes,
        deadline,
        status: 'pending',
        total_price: 199,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating team build:', error);
      return new Response(
        JSON.stringify({ error: 'Unable to create team build request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created team build request ${data.id} for user ${user.id}`);

    return new Response(
      JSON.stringify({ id: data.id, ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Team build request error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

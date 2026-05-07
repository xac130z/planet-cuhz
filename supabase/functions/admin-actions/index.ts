import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const AdminActionSchema = z.object({
  action: z.string().min(1),
});

// Role-Based Access Control (RBAC) configuration
const ROLE_PERMISSIONS = {
  moderator: ['ban_user', 'close_listing', 'mark_spam'],
  admin: ['ban_user', 'close_listing', 'delete_listing', 'mark_spam', 'force_notify'],
  root: ['*'], // All actions
} as const;

// Check if a role has permission for an action
function hasPermission(role: string, action: string): boolean {
  const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
  if (!permissions) return false;
  return permissions.includes('*') || permissions.includes(action);
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user is admin
    const { data: roles, error: roleError } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleError || !roles || roles.length === 0) {
      console.error('Admin check failed:', roleError);
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate input with Zod
    const requestBody = await req.json();
    const validationResult = AdminActionSchema.safeParse({ action: requestBody.action });
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.format() }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action } = validationResult.data;
    const params = { ...requestBody };
    delete params.action;

    // RBAC: Check if user's role has permission for this action
    const userRole = roles[0]?.role;
    if (!hasPermission(userRole, action)) {
      console.warn(`User ${user.id} (role: ${userRole}) attempted unauthorized action: ${action}`);
      await logAudit(supabase, user.id, `unauthorized_attempt:${action}`, 'system', user.id, { 
        role: userRole,
        attempted_action: action 
      });
      return new Response(
        JSON.stringify({ 
          error: 'Forbidden: Insufficient permissions',
          message: `Role '${userRole}' cannot perform action '${action}'` 
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;
    switch (action) {
      case 'ban_user':
        result = await banUser(supabase, user.id, params);
        break;
      case 'close_listing':
        result = await closeListing(supabase, user.id, params);
        break;
      case 'delete_listing':
        result = await deleteListing(supabase, user.id, params);
        break;
      case 'mark_spam':
        result = await markSpam(supabase, user.id, params);
        break;
      case 'force_notify':
        result = await forceNotify(supabase, user.id, params);
        break;
      case 'rebuild_matches':
        result = await rebuildMatches(supabase, user.id, params);
        break;
      case 'run_matcher':
        result = await runMatcher(supabase, user.id);
        break;
      case 'seed_data':
        result = await seedData(supabase, user.id);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin action error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function logAudit(supabase: any, actorId: string, action: string, targetType: string, targetId: string, metadata: any = {}) {
  await supabase.from('admin_audit_logs').insert({
    actor_id: actorId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata
  });
}

async function banUser(supabase: any, actorId: string, params: { userId: string; reason: string; days?: number }) {
  const { userId, reason, days } = params;
  const expiresAt = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : null;

  await supabase.from('ban_list').upsert({
    user_id: userId,
    reason,
    banned_by: actorId,
    expires_at: expiresAt
  });

  await logAudit(supabase, actorId, 'ban_user', 'user', userId, { reason, days });

  return { ok: true, message: 'User banned' };
}

async function closeListing(supabase: any, actorId: string, params: { listingId: string; flagId?: string }) {
  const { listingId, flagId } = params;

  await supabase.from('lfg_listings').update({ status: 'closed' }).eq('id', listingId);

  if (flagId) {
    await supabase.from('content_flags').update({
      status: 'closed',
      resolved_at: new Date().toISOString(),
      resolved_by: actorId
    }).eq('id', flagId);
  }

  await logAudit(supabase, actorId, 'close_listing', 'listing', listingId, { flagId });

  return { ok: true, message: 'Listing closed' };
}

async function deleteListing(supabase: any, actorId: string, params: { listingId: string; flagId?: string }) {
  const { listingId, flagId } = params;

  await supabase.from('lfg_listings').delete().eq('id', listingId);

  if (flagId) {
    await supabase.from('content_flags').update({
      status: 'actioned',
      resolved_at: new Date().toISOString(),
      resolved_by: actorId
    }).eq('id', flagId);
  }

  await logAudit(supabase, actorId, 'delete_listing', 'listing', listingId, { flagId });

  return { ok: true, message: 'Listing deleted' };
}

async function markSpam(supabase: any, actorId: string, params: { listingId: string; flagId?: string }) {
  const { listingId, flagId } = params;

  await supabase.from('lfg_listings').update({ status: 'closed' }).eq('id', listingId);

  if (flagId) {
    await supabase.from('content_flags').update({
      status: 'actioned',
      resolved_at: new Date().toISOString(),
      resolved_by: actorId
    }).eq('id', flagId);
  } else {
    await supabase.from('content_flags').insert({
      listing_id: listingId,
      reporter_id: actorId,
      reason: 'spam',
      details: 'Marked as spam by moderator',
      status: 'actioned'
    });
  }

  await logAudit(supabase, actorId, 'mark_spam', 'listing', listingId, { flagId });

  return { ok: true, message: 'Marked as spam' };
}

async function forceNotify(supabase: any, actorId: string, params: { matchId: string }) {
  const { matchId } = params;

  // Call the notify function
  const { error } = await supabase.functions.invoke('notify', {
    body: { matchId }
  });

  if (error) throw error;

  await logAudit(supabase, actorId, 'force_notify', 'match', matchId, {});

  return { ok: true, message: 'Notification sent' };
}

async function rebuildMatches(supabase: any, actorId: string, params: { scope?: 'recent' | 'all' }) {
  // Call run-matcher function
  const { error } = await supabase.functions.invoke('run-matcher', {
    body: { rebuild: true }
  });

  if (error) throw error;

  await logAudit(supabase, actorId, 'rebuild_matches', 'system', '', { scope: params.scope || 'all' });

  return { ok: true, message: 'Matches rebuilding' };
}

async function runMatcher(supabase: any, actorId: string) {
  const { error } = await supabase.functions.invoke('run-matcher', {
    body: {}
  });

  if (error) throw error;

  await logAudit(supabase, actorId, 'run_matcher', 'system', '', {});

  return { ok: true, message: 'Matcher running' };
}

async function seedData(supabase: any, actorId: string) {
  // Create 6 seed profiles for testing
  const seedProfiles = [
    { twitch_name: 'SeedPlayer1', display_name: 'Seed Player 1', onboarding_completed: true },
    { twitch_name: 'SeedPlayer2', display_name: 'Seed Player 2', onboarding_completed: true },
    { twitch_name: 'SeedPlayer3', display_name: 'Seed Player 3', onboarding_completed: true },
    { twitch_name: 'SeedPlayer4', display_name: 'Seed Player 4', onboarding_completed: true },
    { twitch_name: 'SeedPlayer5', display_name: 'Seed Player 5', onboarding_completed: true },
    { twitch_name: 'SeedPlayer6', display_name: 'Seed Player 6', onboarding_completed: true },
  ];

  // Insert seed users (this is simplified - in production would create actual auth users)
  const { error } = await supabase.from('user_profiles').upsert(seedProfiles, {
    onConflict: 'twitch_name'
  });

  if (error) throw error;

  await logAudit(supabase, actorId, 'seed_data', 'system', '', { count: seedProfiles.length });

  return { ok: true, message: `${seedProfiles.length} seed profiles created` };
}

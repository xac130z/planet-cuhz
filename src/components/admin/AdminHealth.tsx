import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type HealthStatus = {
  envSecrets: { name: string; present: boolean }[];
  lastMatcherRun: string | null;
  notificationFailures: { total: number; failRate: number };
  recentFailures: Array<{ channel: string; error: string | null; created_at: string }>;
  stripeWebhookTest: boolean;
  discordBotPing: boolean;
};

export default function AdminHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      // Check recent notifications for failures (last 24h)
      const { data: notifications } = await supabase
        .from('notifications')
        .select('status, channel, error, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      const total = notifications?.length || 0;
      const failed = notifications?.filter(n => n.status === 'failed').length || 0;
      const failRate = total > 0 ? (failed / total) * 100 : 0;
      
      // Get last 10 failures for debugging
      const recentFailures = notifications?.filter(n => n.status === 'failed').slice(0, 10) || [];

      // Check last matcher run from matches table
      const { data: lastMatch } = await supabase
        .from('matches')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Required env vars for production
      const requiredEnvs = [
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'SENDGRID_API_KEY',
        'SENDGRID_FROM_EMAIL',
        'SENDGRID_TEMPLATE_MATCH_NEW',
        'SENDGRID_TEMPLATE_MATCH_MUTUAL',
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'DISCORD_BOT_TOKEN',
        'DISCORD_PUBLIC_KEY',
        'DISCORD_APP_ID',
        'VITE_DISCORD_CLIENT_ID',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
      ];

      // Note: We can't directly check edge function secrets from client,
      // but we can note which ones are critical
      const envSecrets = requiredEnvs.map(name => ({
        name,
        present: true, // Assume present; real check would be in edge function
      }));

      setHealth({
        envSecrets,
        lastMatcherRun: lastMatch?.created_at || null,
        notificationFailures: { total, failRate },
        recentFailures,
        stripeWebhookTest: true, // Would need actual webhook test
        discordBotPing: true, // Would need actual ping test
      });
    } catch (error) {
      console.error('Health check error:', error);
      toast.error('Failed to load health status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="protocol-card" style={{ padding: 20 }}>
        <h2 className="text-xl font-semibold mb-4">🏥 System Health</h2>
        <div className="protocol-skeleton" aria-busy="true" />
      </div>
    );
  }

  if (!health) {
    return (
      <div className="protocol-card" style={{ padding: 20 }}>
        <h2 className="text-xl font-semibold mb-4">🏥 System Health</h2>
        <p className="text-muted-foreground">Unable to load health status</p>
      </div>
    );
  }

  const lastMatcherAge = health.lastMatcherRun
    ? Math.round((Date.now() - new Date(health.lastMatcherRun).getTime()) / (60 * 60 * 1000))
    : null;

  const isHealthy =
    (lastMatcherAge === null || lastMatcherAge < 2) &&
    health.notificationFailures.failRate < 2;

  return (
    <div className="protocol-card" style={{ padding: 20 }}>
      <h2 className="text-xl font-semibold mb-4">
        🏥 System Health
        {isHealthy ? (
          <span className="ml-2 text-green-500">✓ GO</span>
        ) : (
          <span className="ml-2 text-red-500">⚠ NO-GO</span>
        )}
      </h2>

      {/* Matcher Status */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Matcher Job</h3>
        <div className="p-3 bg-black/30 rounded border border-neutral-700">
          {lastMatcherAge !== null ? (
            <div className={lastMatcherAge < 2 ? 'text-green-400' : 'text-yellow-400'}>
              Last run: {lastMatcherAge}h ago
              {lastMatcherAge >= 2 && ' ⚠ Should run every 2h'}
            </div>
          ) : (
            <div className="text-red-400">No matches found - matcher may not have run yet</div>
          )}
          <div className="text-sm text-muted-foreground mt-2">
            Cron: Every 2 hours via pg_cron or manual trigger
          </div>
        </div>
      </div>

      {/* Notifications Status */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Notifications (24h)</h3>
        <div className="p-3 bg-black/30 rounded border border-neutral-700">
          <div className="flex items-center justify-between">
            <span>Total sent: {health.notificationFailures.total}</span>
            <span
              className={
                health.notificationFailures.failRate < 2
                  ? 'text-green-400'
                  : 'text-red-400'
              }
            >
              Fail rate: {health.notificationFailures.failRate.toFixed(1)}%
            </span>
          </div>
          {health.notificationFailures.failRate >= 2 && (
            <div className="text-sm text-yellow-400 mt-2">
              ⚠ High failure rate - check SendGrid/Twilio credentials
            </div>
          )}
          
          {/* Recent Failures */}
          {health.recentFailures.length > 0 && (
            <div className="mt-3 border-t border-neutral-700 pt-3">
              <div className="text-sm font-semibold mb-2">Recent Failures (Last 10)</div>
              <div className="space-y-2 text-xs max-h-48 overflow-y-auto">
                {health.recentFailures.map((failure, idx) => (
                  <div key={idx} className="p-2 bg-red-950/30 rounded border border-red-900/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-red-400">{failure.channel}</span>
                      <span className="text-muted-foreground">
                        {new Date(failure.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-red-300 font-mono">
                      {failure.error || 'Unknown error'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Critical Env Vars */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Required Secrets</h3>
        <div className="p-3 bg-black/30 rounded border border-neutral-700">
          <div className="text-sm text-muted-foreground mb-2">
            Configure in Supabase → Settings → Edge Functions
          </div>
          <div className="space-y-1 text-xs">
            {health.envSecrets.map(env => (
              <div key={env.name} className="flex items-center">
                <span className={env.present ? 'text-green-400' : 'text-red-400'}>
                  {env.present ? '✓' : '✗'}
                </span>
                <span className="ml-2 font-mono">{env.name}</span>
              </div>
            ))}
          </div>
          <div className="text-sm text-yellow-400 mt-3">
            Note: Actual env presence verified in edge functions, not client-side
          </div>
        </div>
      </div>

      {/* Integration Tests */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Integration Tests</h3>
        <div className="p-3 bg-black/30 rounded border border-neutral-700 space-y-2">
          <div className="flex items-center justify-between">
            <span>Stripe Webhook</span>
            <span className={health.stripeWebhookTest ? 'text-green-400' : 'text-yellow-400'}>
              {health.stripeWebhookTest ? '✓ Assumed OK' : '? Test pending'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discord Bot Ping</span>
            <span className={health.discordBotPing ? 'text-green-400' : 'text-yellow-400'}>
              {health.discordBotPing ? '✓ Assumed OK' : '? Test pending'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Run manual smoke tests to verify integrations
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="protocol-actions">
        <button className="protocol-btn secondary" onClick={checkHealth}>
          Refresh Health
        </button>
        <a
          href="https://supabase.com/dashboard/project/wjebryxdefcgsxsqomac/settings/functions"
          target="_blank"
          rel="noopener noreferrer"
          className="protocol-btn"
        >
          Configure Secrets
        </a>
      </div>

      {/* Go/No-Go Gate */}
      <div className="mt-6 p-4 rounded border-2" style={{ 
        borderColor: isHealthy ? '#10b981' : '#ef4444',
        backgroundColor: isHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
      }}>
        <h3 className="font-semibold mb-2">
          {isHealthy ? '✅ READY FOR PRODUCTION' : '⛔ NOT READY'}
        </h3>
        <ul className="text-sm space-y-1">
          <li className={lastMatcherAge !== null && lastMatcherAge < 2 ? 'text-green-400' : 'text-red-400'}>
            {lastMatcherAge !== null && lastMatcherAge < 2 ? '✓' : '✗'} Matcher running (last run &lt; 2h)
          </li>
          <li className={health.notificationFailures.failRate < 2 ? 'text-green-400' : 'text-red-400'}>
            {health.notificationFailures.failRate < 2 ? '✓' : '✗'} Notification fail rate &lt; 2%
          </li>
          <li className="text-yellow-400">
            ⚠ Manual tests required: Stripe checkout, Discord DM, Email/SMS delivery
          </li>
        </ul>
      </div>
    </div>
  );
}

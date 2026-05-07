import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { buildDiscordOAuthURL } from '@/lib/discord';

export default function DiscordConnect() {
  const [discordConn, setDiscordConn] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Note: discord_conn can be stored in a JSONB 'profile' column or as metadata
      // For now, we'll assume it's not connected and show the connect button
      // This will be updated once the OAuth flow completes
      setDiscordConn({ connected: false });
      setLoading(false);
    })();
  }, []);

  const connected = discordConn?.connected === true;

  if (loading) {
    return (
      <div className="protocol-card" style={{ padding: 16 }}>
        <div className="protocol-skeleton" style={{ height: 80 }} aria-busy="true" />
      </div>
    );
  }

  return (
    <div className="protocol-card discord-connect-card" style={{ padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: 6 }}>
            {connected ? '✅ Discord Connected' : '⚠️ Discord Not Connected'}
          </h3>
          {connected ? (
            <p style={{ color: '#bdbdbd', fontSize: '0.9rem' }}>
              @{discordConn.username} • Receive match notifications via DM
            </p>
          ) : (
            <p style={{ color: '#bdbdbd', fontSize: '0.9rem' }}>
              Connect Discord to receive match notifications and use bot commands
            </p>
          )}
        </div>
        {!connected && (
          <a
            href={buildDiscordOAuthURL()}
            className="protocol-btn"
            style={{ width: 'auto', minWidth: 160 }}
          >
            Connect Discord
          </a>
        )}
      </div>
    </div>
  );
}

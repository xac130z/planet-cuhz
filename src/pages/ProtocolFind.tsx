import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Profile {
  id: string;
  display_name: string;
  twitch_login: string | null;
  twitch_url: string | null;
  region: string;
  timezone: string;
  platform: string;
  psn: string | null;
  xbox: string | null;
  discord: string | null;
  twitter: string | null;
  role: string;
  modes: string[];
  playstyle: string[];
  availability: any;
  mic: boolean;
  bio: string | null;
  verified: boolean;
  created_at: string;
}

export default function ProtocolFind() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: '',
    role: '',
    region: '',
    mic: 'any',
  });

  useEffect(() => {
    loadProfiles();
  }, [filters]);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('protocol_public_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filters.platform) query = query.eq('platform', filters.platform);
      if (filters.role) query = query.eq('role', filters.role);
      if (filters.region) query = query.eq('region', filters.region);
      if (filters.mic !== 'any') query = query.eq('mic', filters.mic === 'yes');

      const { data, error } = await query;
      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Load profiles error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 holographic-text text-center">
            Find Your Squad
          </h1>

          {/* Filters */}
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <select 
              className="p-3 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg"
              value={filters.platform}
              onChange={e => setFilters({ ...filters, platform: e.target.value })}
            >
              <option value="">All Platforms</option>
              <option value="PSN">PSN</option>
              <option value="Xbox">Xbox</option>
              <option value="PC">PC</option>
              <option value="Switch">Switch</option>
            </select>

            <select 
              className="p-3 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg"
              value={filters.role}
              onChange={e => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">All Roles</option>
              <option value="PG">PG</option>
              <option value="SG">SG</option>
              <option value="SF">SF</option>
              <option value="PF">PF</option>
              <option value="C">C</option>
            </select>

            <select 
              className="p-3 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg"
              value={filters.region}
              onChange={e => setFilters({ ...filters, region: e.target.value })}
            >
              <option value="">All Regions</option>
              <option value="NA-East">NA-East</option>
              <option value="NA-West">NA-West</option>
              <option value="EU">EU</option>
              <option value="Asia">Asia</option>
              <option value="SA">SA</option>
              <option value="Oceania">Oceania</option>
            </select>

            <select 
              className="p-3 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg"
              value={filters.mic}
              onChange={e => setFilters({ ...filters, mic: e.target.value })}
            >
              <option value="any">Mic: Any</option>
              <option value="yes">Mic: Yes</option>
              <option value="no">Mic: No</option>
            </select>
          </div>

          {/* Profiles Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading squad members...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-6xl mb-4">🏀</div>
                <h3 className="text-2xl font-bold holographic-text">No Squad Members Yet</h3>
                <p className="text-muted-foreground">
                  Be the first to join the Protocol! Complete your onboarding to appear in the directory and connect with other players.
                </p>
                <div className="pt-4">
                  <a 
                    href="/protocol/auth"
                    className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    Join the Protocol
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map(profile => (
                <Card 
                  key={profile.id} 
                  className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center justify-between">
                      <span>{profile.display_name}</span>
                      {profile.verified && <span className="text-xs">✓</span>}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {profile.role} • {profile.platform}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {profile.modes.slice(0, 3).map((mode, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {mode}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {profile.region} • {profile.mic ? '🎤' : ''}
                    </div>
                    <div className="flex gap-3 pt-2">
                      {profile.twitch_url && (
                        <a 
                          href={profile.twitch_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Twitch
                        </a>
                      )}
                      {profile.discord && (
                        <a 
                          href={`https://discord.com/users/${profile.discord}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Discord
                        </a>
                      )}
                    </div>
                    <a 
                      href={`/protocol/profile/${profile.id}`}
                      className="block w-full text-center py-2 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
                    >
                      View Profile
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

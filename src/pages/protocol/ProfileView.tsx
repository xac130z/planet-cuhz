import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  archetype_primary: string | null;
  archetype_secondary: string | null;
  height_in: number | null;
  weight_lb: number | null;
  hand: string | null;
  overall_rating: number | null;
  win_percentage: number | null;
  competitive_level: string | null;
  availability: any;
  mic: boolean;
  bio: string | null;
  verified: boolean;
  created_at: string;
}

export default function ProfileView() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('protocol_public_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Load profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
        </div>
        <Header />
        <main className="pt-32 pb-20 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <Link to="/protocol/find" className="text-primary hover:underline">
            Back to Directory
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-space via-cosmic-purple to-deep-space"></div>
      </div>
      
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link to="/protocol" className="hover:text-primary">Protocol</Link>
            {' > '}
            <Link to="/protocol/find" className="hover:text-primary">Find</Link>
            {' > '}
            <span className="text-foreground">{profile.display_name}</span>
          </nav>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mb-6">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                {profile.display_name}
                {profile.verified && <Badge>Verified</Badge>}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">{profile.role}</Badge>
                <Badge variant="outline">{profile.platform}</Badge>
                {profile.competitive_level && (
                  <Badge variant="outline">{profile.competitive_level}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stats */}
              {(profile.overall_rating || profile.win_percentage) && (
                <div className="grid grid-cols-2 gap-4">
                  {profile.overall_rating && (
                    <div>
                      <div className="text-sm text-muted-foreground">Overall</div>
                      <div className="text-2xl font-bold">{profile.overall_rating}</div>
                    </div>
                  )}
                  {profile.win_percentage && (
                    <div>
                      <div className="text-sm text-muted-foreground">Win %</div>
                      <div className="text-2xl font-bold">{profile.win_percentage}%</div>
                    </div>
                  )}
                </div>
              )}

              {/* Build Info */}
              {(profile.height_in || profile.weight_lb || profile.hand) && (
                <div>
                  <h3 className="font-semibold mb-2">Build</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {profile.height_in && <div>Height: {Math.floor(profile.height_in / 12)}'{profile.height_in % 12}"</div>}
                    {profile.weight_lb && <div>Weight: {profile.weight_lb} lbs</div>}
                    {profile.hand && <div>Hand: {profile.hand}</div>}
                  </div>
                </div>
              )}

              {/* Archetypes */}
              {(profile.archetype_primary || profile.archetype_secondary) && (
                <div>
                  <h3 className="font-semibold mb-2">Archetypes</h3>
                  <div className="flex gap-2">
                    {profile.archetype_primary && <Badge>{profile.archetype_primary}</Badge>}
                    {profile.archetype_secondary && <Badge variant="secondary">{profile.archetype_secondary}</Badge>}
                  </div>
                </div>
              )}

              {/* Modes */}
              <div>
                <h3 className="font-semibold mb-2">Modes</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.modes.map((mode, i) => (
                    <Badge key={i} variant="outline">{mode}</Badge>
                  ))}
                </div>
              </div>

              {/* Playstyle */}
              {profile.playstyle.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Playstyle</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.playstyle.map((style, i) => (
                      <Badge key={i} variant="secondary">{style}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Location & Availability */}
              <div>
                <h3 className="font-semibold mb-2">Location & Availability</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Region: {profile.region}</div>
                  <div>Timezone: {profile.timezone}</div>
                  <div>Mic: {profile.mic ? 'Yes' : 'No'}</div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              )}

              {/* Contact */}
              <div>
                <h3 className="font-semibold mb-3">Connect</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.twitch_url && (
                    <a 
                      href={profile.twitch_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
                    >
                      Twitch
                    </a>
                  )}
                  {profile.discord && (
                    <a 
                      href={`https://discord.com/users/${profile.discord}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
                    >
                      Discord
                    </a>
                  )}
                  {profile.twitter && (
                    <a 
                      href={`https://twitter.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {profile.psn && (
                    <div className="px-4 py-2 bg-card border border-primary/20 rounded">
                      <div className="text-xs text-muted-foreground">PSN</div>
                      <div className="text-sm">{profile.psn}</div>
                    </div>
                  )}
                  {profile.xbox && (
                    <div className="px-4 py-2 bg-card border border-primary/20 rounded">
                      <div className="text-xs text-muted-foreground">Xbox</div>
                      <div className="text-sm">{profile.xbox}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/protocol/find" className="text-primary hover:underline">
              ← Back to Directory
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

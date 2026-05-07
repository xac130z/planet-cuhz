import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Stepper } from '@/components/protocol/Stepper';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Info, Eye, EyeOff } from 'lucide-react';
import '@/styles/portal-theme.css';
import '@/styles/protocol-onboarding.css';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  display_name: string;
  email: string;
  region: string;
  timezone: string;
  languages: string[];
  platform: 'PSN' | 'Xbox' | 'PC' | 'Switch' | '';
  psn: string;
  xbox: string;
  discord: string;
  twitter: string;
  role: 'PG' | 'SG' | 'SF' | 'PF' | 'C' | '';
  modes: string[];
  playstyle: string[];
  archetype_primary: string;
  archetype_secondary: string;
  height_in: number | null;
  weight_lb: number | null;
  hand: 'Left' | 'Right' | '';
  overall_rating: number | null;
  win_percentage: number | null;
  experience_years: number | null;
  competitive_level: 'casual' | 'competitive' | 'elite' | '';
  availability: any;
  mic: boolean;
  phone: string;
  preferred_contact: string;
  allow_contact: boolean;
  consent_comms: boolean;
  bio: string;
  published: boolean;
}

const emptyForm: FormData = {
  display_name: '',
  email: '',
  region: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  languages: [],
  platform: '',
  psn: '',
  xbox: '',
  discord: '',
  twitter: '',
  role: '',
  modes: [],
  playstyle: [],
  archetype_primary: '',
  archetype_secondary: '',
  height_in: null,
  weight_lb: null,
  hand: '',
  overall_rating: null,
  win_percentage: null,
  experience_years: null,
  competitive_level: '',
  availability: { days: [], start: '19:00', end: '23:00' },
  mic: true,
  phone: '',
  preferred_contact: 'email',
  allow_contact: true,
  consent_comms: true,
  bio: '',
  published: false,
};

export default function OnboardingProtocol() {
  const [step, setStep] = useState<Step>(1);
  const [uid, setUid] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        nav('/protocol/auth');
        return;
      }
      
      setUid(user.id);
      
      // Prefill Twitch data
      const displayName = user.user_metadata?.name || user.user_metadata?.preferred_username || '';
      const email = user.user_metadata?.email || '';
      
      // Load existing draft if present
      const { data: profile } = await supabase
        .from('protocol_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile) {
        setForm(profile as any);
      } else {
        setForm(prev => ({ ...prev, display_name: displayName, email }));
      }
    };
    
    loadUser();
  }, [nav]);

  const saveDraft = async (updates: Partial<FormData> = {}) => {
    if (!uid) return false;
    
    setSaving(true);
    try {
      const payload = { 
        id: uid, 
        ...form, 
        ...updates, 
        updated_at: new Date().toISOString(),
        published: false 
      };
      
      const { error } = await supabase
        .from('protocol_profiles')
        .upsert(payload, { onConflict: 'id' });
      
      if (error) throw error;
      
      if (Object.keys(updates).length) {
        setForm(prev => ({ ...prev, ...updates }));
      }
      
      return true;
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save. Please try again.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const publishProfile = async () => {
    // Validate required fields
    if (!form.platform || !form.role || form.modes.length === 0) {
      toast.error('Please fill in Platform, Role, and at least one Mode.');
      return;
    }
    
    if (!form.region || !form.timezone) {
      toast.error('Please fill in Region and Timezone.');
      return;
    }
    
    // Show confirmation dialog first
    setShowPublishConfirm(true);
  };

  const confirmPublish = async () => {
    setSaving(true);
    setShowPublishConfirm(false);
    const success = await saveDraft({ published: true });
    if (success) {
      toast.success('Profile published!');
      nav('/protocol/find');
    }
    setSaving(false);
  };

  const nextStep = async () => {
    const success = await saveDraft();
    if (success && step < 6) {
      setStep((step + 1) as Step);
    }
  };

  const prevStep = async () => {
    await saveDraft();
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  return (
    <main className="portal-wrapper" data-page="protocol-onboarding">
      <section className="onb-card glass enter">
        <h1 className="portal-title">Protocol Onboarding</h1>
        <Stepper active="ONBOARD" />
        
        <div className="flex gap-2 text-sm text-neutral-400 mt-4 justify-center">
          {[1, 2, 3, 4, 5, 6].map(s => (
            <span 
              key={s} 
              className={s === step ? 'text-cyan-400 font-semibold' : ''}
              aria-current={s === step ? 'step' : undefined}
            >
              Step {s}
            </span>
          ))}
        </div>

      {step === 1 && (
        <form className="onb-form">
          <h2 className="text-xl font-semibold text-white mb-4">Basics</h2>
          <div className="field">
            <label htmlFor="display_name">Display Name*</label>
            <input 
              id="display_name"
              required
              value={form.display_name}
              onChange={e => setForm({ ...form, display_name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email*</label>
            <input 
              id="email"
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="region">Region*</label>
            <select 
              id="region"
              required
              value={form.region}
              onChange={e => setForm({ ...form, region: e.target.value })}
            >
              <option value="">Select region</option>
              <option value="NA-East">NA-East</option>
              <option value="NA-West">NA-West</option>
              <option value="EU">EU</option>
              <option value="Asia">Asia</option>
              <option value="SA">SA</option>
              <option value="Oceania">Oceania</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="timezone">Timezone*</label>
            <input 
              id="timezone"
              required
              value={form.timezone}
              onChange={e => setForm({ ...form, timezone: e.target.value })}
            />
          </div>
          <div className="onb-actions">
            <button type="button" onClick={nextStep} disabled={saving} className="onb-btn-primary">
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="protocol-card space-y-4">
          <h2 className="text-xl font-semibold">Accounts</h2>
          <div>
            <label htmlFor="platform" className="block text-sm mb-1">Platform*</label>
            <select 
              id="platform"
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              value={form.platform}
              onChange={e => setForm({ ...form, platform: e.target.value as any })}
            >
              <option value="">Select platform</option>
              <option value="PSN">PSN</option>
              <option value="Xbox">Xbox</option>
              <option value="PC">PC</option>
              <option value="Switch">Switch</option>
            </select>
          </div>
          <div>
            <label htmlFor="psn" className="block text-sm mb-1">PSN ID</label>
            <input 
              id="psn"
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              value={form.psn}
              onChange={e => setForm({ ...form, psn: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="xbox" className="block text-sm mb-1">Xbox Gamertag</label>
            <input 
              id="xbox"
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              value={form.xbox}
              onChange={e => setForm({ ...form, xbox: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="discord" className="block text-sm mb-1">Discord</label>
            <input 
              id="discord"
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              value={form.discord}
              onChange={e => setForm({ ...form, discord: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="twitter" className="block text-sm mb-1">Twitter</label>
            <input 
              id="twitter"
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              value={form.twitter}
              onChange={e => setForm({ ...form, twitter: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={prevStep} disabled={saving} className="protocol-btn-secondary flex-1">Back</button>
            <button onClick={nextStep} disabled={saving} className="protocol-btn flex-1">
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="protocol-card space-y-4">
          <h2 className="text-xl font-semibold">2K Build</h2>
          <div>
            <label htmlFor="role" className="block text-sm mb-1">Role*</label>
            <select 
              id="role"
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value as any })}
            >
              <option value="">Select role</option>
              <option value="PG">PG</option>
              <option value="SG">SG</option>
              <option value="SF">SF</option>
              <option value="PF">PF</option>
              <option value="C">C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Modes* (comma-separated)</label>
            <input 
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. Rec, Pro-Am, Park"
              value={form.modes.join(', ')}
              onChange={e => setForm({ ...form, modes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Playstyle (comma-separated)</label>
            <input 
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. Lock, Sharpshooter"
              value={form.playstyle.join(', ')}
              onChange={e => setForm({ ...form, playstyle: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            />
          </div>
          <div>
            <label htmlFor="competitive_level" className="block text-sm mb-1">Competitive Level</label>
            <select 
              id="competitive_level"
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              value={form.competitive_level}
              onChange={e => setForm({ ...form, competitive_level: e.target.value as any })}
            >
              <option value="">Select level</option>
              <option value="casual">Casual</option>
              <option value="competitive">Competitive</option>
              <option value="elite">Elite</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={prevStep} disabled={saving} className="protocol-btn-secondary flex-1">Back</button>
            <button onClick={nextStep} disabled={saving} className="protocol-btn flex-1">
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="protocol-card space-y-4">
          <h2 className="text-xl font-semibold">Availability</h2>
          <div>
            <label className="block text-sm mb-1">Availability (JSON format)</label>
            <textarea 
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              rows={3}
              placeholder='{"days":["Mon","Tue"],"start":"19:00","end":"23:00"}'
              value={JSON.stringify(form.availability)}
              onChange={e => {
                try {
                  setForm({ ...form, availability: JSON.parse(e.target.value || '{}') });
                } catch {}
              }}
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox"
                checked={form.mic}
                onChange={e => setForm({ ...form, mic: e.target.checked })}
              />
              <span>Mic available</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={prevStep} disabled={saving} className="protocol-btn-secondary flex-1">Back</button>
            <button onClick={nextStep} disabled={saving} className="protocol-btn flex-1">
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="protocol-card space-y-4">
          <h2 className="text-xl font-semibold">Contact</h2>
          
          <Alert className="bg-cyan-950/30 border-cyan-700/50">
            <Info className="h-4 w-4 text-cyan-500" />
            <AlertDescription className="text-sm text-cyan-100/90">
              <strong>Privacy Notice:</strong> If you enable "Allow others to contact me" and publish your profile, the following information will be publicly visible to other players:
              <ul className="mt-2 ml-4 space-y-1 list-disc text-xs">
                <li>Display name, platform, role, and game modes</li>
                <li>Region, timezone, and availability schedule</li>
                <li>Playstyle, archetypes, and stats (if provided)</li>
                <li>Bio and gaming handles (PSN, Xbox, Discord, Twitter)</li>
                <li><strong className="text-yellow-400">Your email address (if provided)</strong></li>
              </ul>
              <p className="mt-2 text-xs">You can unpublish your profile at any time to remove it from public view.</p>
            </AlertDescription>
          </Alert>

          <div>
            <label htmlFor="phone" className="block text-sm mb-1">Phone (optional)</label>
            <input 
              id="phone"
              type="tel"
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <p className="text-xs text-neutral-500 mt-1">Phone numbers are never publicly visible</p>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox"
                checked={form.allow_contact}
                onChange={e => setForm({ ...form, allow_contact: e.target.checked })}
              />
              <span>Allow others to contact me</span>
            </label>
            <p className="text-xs text-neutral-500 mt-1 ml-6">
              {form.allow_contact ? '✓ Your profile will be visible to other players when published' : '✗ Your profile will remain private'}
            </p>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox"
                checked={form.consent_comms}
                onChange={e => setForm({ ...form, consent_comms: e.target.checked })}
              />
              <span>I consent to receive communications</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={prevStep} disabled={saving} className="protocol-btn-secondary flex-1">Back</button>
            <button onClick={nextStep} disabled={saving} className="protocol-btn flex-1">
              {saving ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="protocol-card space-y-4">
          <h2 className="text-xl font-semibold">Review & Publish</h2>
          
          <div className="p-4 bg-neutral-900 rounded border border-neutral-700 space-y-2">
            <div className="font-semibold text-lg">{form.display_name}</div>
            <div className="text-sm text-neutral-400">
              {form.role} • {form.platform} • {form.modes.join(' / ')}
            </div>
            <div className="text-sm text-neutral-500">
              {form.region} • {form.timezone}
            </div>
          </div>

          {form.allow_contact && (
            <div className="p-4 bg-cyan-950/20 rounded border border-cyan-700/30 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <Eye className="h-4 w-4" />
                <span>What Others Will See</span>
              </div>
              <div className="text-xs text-neutral-300 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Name:</strong> {form.display_name}</div>
                  <div><strong>Platform:</strong> {form.platform}</div>
                  <div><strong>Role:</strong> {form.role}</div>
                  <div><strong>Region:</strong> {form.region || 'Not set'}</div>
                  <div><strong>Timezone:</strong> {form.timezone}</div>
                  <div><strong>Modes:</strong> {form.modes.join(', ') || 'None'}</div>
                </div>
                {form.email && (
                  <div className="p-2 bg-yellow-950/30 border border-yellow-700/50 rounded">
                    <strong className="text-yellow-400">Email:</strong> {form.email}
                  </div>
                )}
                {(form.psn || form.xbox || form.discord || form.twitter) && (
                  <div className="text-xs">
                    <strong>Handles:</strong> {[form.psn && `PSN: ${form.psn}`, form.xbox && `Xbox: ${form.xbox}`, form.discord && `Discord: ${form.discord}`, form.twitter && `Twitter: ${form.twitter}`].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {!form.allow_contact && (
            <Alert className="bg-neutral-900/50 border-neutral-700">
              <EyeOff className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Your profile will remain private. Enable "Allow others to contact me" in the previous step to make your profile visible to other players.
              </AlertDescription>
            </Alert>
          )}

          <div>
            <label htmlFor="bio" className="block text-sm mb-1">Bio (optional, max 500 chars)</label>
            <textarea 
              id="bio"
              className="w-full p-3 bg-neutral-900 rounded border border-neutral-700 focus:border-cyan-500 focus:outline-none"
              rows={3}
              maxLength={500}
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={prevStep} disabled={saving} className="protocol-btn-secondary flex-1">Back</button>
            <button 
              onClick={publishProfile} 
              disabled={saving || !form.allow_contact} 
              className="protocol-btn flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!form.allow_contact ? 'Enable "Allow others to contact me" to publish' : ''}
            >
              {saving ? 'Publishing...' : 'Publish to Directory'}
            </button>
          </div>
        </div>
      )}

      <AlertDialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <AlertDialogContent className="bg-neutral-900 border-cyan-700/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cyan-400">Publish Your Profile?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-300 space-y-3">
              <p>Your profile will be publicly visible to all players in the directory.</p>
              
              <div className="p-3 bg-cyan-950/30 rounded border border-cyan-700/30 text-xs space-y-2">
                <div className="font-semibold text-cyan-400">Publicly Visible Information:</div>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Display name, platform, role, and game modes</li>
                  <li>Region, timezone, and availability</li>
                  <li>Stats, playstyle, and archetypes</li>
                  <li>Gaming handles (PSN, Xbox, Discord, Twitter)</li>
                  {form.email && <li className="text-yellow-400 font-semibold">Email: {form.email}</li>}
                </ul>
              </div>

              <p className="text-xs text-neutral-400">
                You can unpublish your profile at any time from your account settings.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-neutral-800 hover:bg-neutral-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPublish}
              className="bg-cyan-600 hover:bg-cyan-700"
              disabled={saving}
            >
              {saving ? 'Publishing...' : 'Publish Profile'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </section>
    </main>
  );
}

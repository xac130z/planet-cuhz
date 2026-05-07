import { useState } from 'react';
import AvailabilityGrid from './AvailabilityGrid';
import { validateHandles, reachabilityGuard } from '../../../lib/validation';

export type GlobalState = {
  display_name: string;
  email?: string|null; phone?: string|null;
  timezone: string; region: string; languages: string[];
  mic: boolean; preferred_contact: 'email'|'sms'|'discord'|'both'|'none';
  consent_comms: boolean;
  digest_cadence?: 'daily'|'weekly'|'off';
  handles: { psn?: string|null; xbox?: string|null; discord?: string|null; twitch?: string|null };
  share_handles: 'public'|'matches'|'none';
  interests: string[]; spiritual: { zodiacChinese?: string; lifePathNumber?: string|null };
  availability: { day:string; start:string; end:string }[];
};

const regions = ['NA-East','NA-West','EU','Asia','SA','Oceania','Other'];
const tzGuess = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';

export default function StepGlobal({ value, onChange, onValidate }:{
  value: GlobalState; onChange: (v: GlobalState)=>void; onValidate: (ok:boolean, msg?:string)=>void
}) {
  const [langInput, setLangInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const set = <K extends keyof GlobalState>(k:K, v:GlobalState[K]) => onChange({ ...value, [k]: v });

  const runValidate = () => {
    const err = validateHandles(value.handles);
    if (err) return onValidate(false, err);
    const reach = reachabilityGuard(value.share_handles, value.email, value.phone);
    if (reach) return onValidate(false, reach);
    onValidate(true);
  };

  return (
    <div className="protocol-form" onBlur={runValidate}>
      <div className="protocol-field">
        <label className="protocol-label" htmlFor="display_name">Display Name</label>
        <input id="display_name" className="protocol-input" value={value.display_name} onChange={e=>set('display_name', e.target.value)} />
      </div>

      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label" htmlFor="timezone">Timezone</label>
          <input id="timezone" className="protocol-input" value={value.timezone} onChange={e=>set('timezone', e.target.value)} placeholder={tzGuess} />
          <div className="protocol-help">IANA timezone (e.g., {tzGuess})</div>
        </div>
        <div className="protocol-field">
          <label className="protocol-label" htmlFor="region">Region</label>
          <select id="region" className="protocol-select" value={value.region} onChange={e=>set('region', e.target.value)}>
            {regions.map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label">Languages (comma or add)</label>
          <div>
            {value.languages.map((l,i)=>(
              <span className="chip" key={i}>{l}<button onClick={()=>set('languages', value.languages.filter((_,j)=>j!==i))}>✕</button></span>
            ))}
          </div>
          <input className="protocol-input" value={langInput} onChange={e=>setLangInput(e.target.value)}
            onKeyDown={e=>{ if (e.key==='Enter' && langInput.trim()) { set('languages', [...value.languages, langInput.trim()]); setLangInput(''); e.preventDefault(); }}} />
        </div>
        <div className="protocol-field">
          <label className="protocol-label" htmlFor="mic">Microphone</label>
          <select id="mic" className="protocol-select" value={value.mic ? 'yes':'no'} onChange={e=>set('mic', e.target.value==='yes')}>
            <option value="yes">Yes</option><option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label">Preferred Contact</label>
          <select className="protocol-select" value={value.preferred_contact} onChange={e=>set('preferred_contact', e.target.value as any)}>
            <option value="email">Email</option><option value="sms">SMS</option>
            <option value="discord">Discord</option><option value="both">Email + SMS</option><option value="none">None</option>
          </select>
          <div className="protocol-help">We respect consent & your preferences.</div>
        </div>
        <div className="protocol-field">
          <label className="protocol-label">Consent to communications</label>
          <select className="protocol-select" value={value.consent_comms ? 'yes':'no'} onChange={e=>set('consent_comms', e.target.value==='yes')}>
            <option value="yes">Yes</option><option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label" htmlFor="email">Email (optional)</label>
          <input id="email" className="protocol-input" value={value.email ?? ''} onChange={e=>set('email', e.target.value)} />
        </div>
        <div className="protocol-field">
          <label className="protocol-label" htmlFor="phone">Phone (optional)</label>
          <input id="phone" className="protocol-input" value={value.phone ?? ''} onChange={e=>set('phone', e.target.value)} />
        </div>
      </div>

      <div className="protocol-field">
        <label className="protocol-label" htmlFor="digest_cadence">Squad Digest Frequency</label>
        <select id="digest_cadence" className="protocol-select" value={value.digest_cadence ?? 'daily'} onChange={e=>set('digest_cadence', e.target.value as any)}>
          <option value="daily">Daily (recommended)</option>
          <option value="weekly">Weekly</option>
          <option value="off">Off</option>
        </select>
        <div className="protocol-help">Get updates about new squad matches based on your preferences.</div>
      </div>

      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label">Handles</label>
          <div className="protocol-row">
            <input className="protocol-input" placeholder="PSN" value={value.handles.psn ?? ''} onChange={e=>set('handles', {...value.handles, psn:e.target.value})}/>
            <input className="protocol-input" placeholder="Xbox" value={value.handles.xbox ?? ''} onChange={e=>set('handles', {...value.handles, xbox:e.target.value})}/>
          </div>
          <div className="protocol-row">
            <input className="protocol-input" placeholder="Discord" value={value.handles.discord ?? ''} onChange={e=>set('handles', {...value.handles, discord:e.target.value})}/>
            <input className="protocol-input" placeholder="Twitch" value={value.handles.twitch ?? ''} onChange={e=>set('handles', {...value.handles, twitch:e.target.value})}/>
          </div>
          <div className="protocol-help">No URLs or line breaks. Discord/Twitch: we'll strip "@", lowercase.</div>
        </div>
        <div className="protocol-field">
          <label className="protocol-label">Handle Sharing</label>
          <select className="protocol-select" value={value.share_handles} onChange={e=>set('share_handles', e.target.value as any)}>
            <option value="public">Public</option><option value="matches">Matches only</option><option value="none">Private</option>
          </select>
        </div>
      </div>

      <div className="protocol-field">
        <label className="protocol-label">Common Interests</label>
        <div>
          {value.interests.map((l,i)=>(
            <span className="chip" key={i}>{l}<button onClick={()=>set('interests', value.interests.filter((_,j)=>j!==i))}>✕</button></span>
          ))}
        </div>
        <input className="protocol-input" value={interestInput} onChange={e=>setInterestInput(e.target.value)}
          onKeyDown={e=>{ if (e.key==='Enter' && interestInput.trim()) { set('interests', [...value.interests, interestInput.trim()]); setInterestInput(''); e.preventDefault(); }}} />
      </div>

      <div className="protocol-field">
        <label className="protocol-label">Availability</label>
        <AvailabilityGrid value={value.availability} onChange={v=>set('availability', v)} />
      </div>
    </div>
  );
}

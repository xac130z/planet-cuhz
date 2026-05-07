import { norm } from '../../../lib/normalize';

export type NBA2KState = {
  platform: 'PS5'|'Xbox Series'|'PC'|'Switch'|'Other';
  allowsCrossplay: boolean;
  positions: { primary:'PG'|'SG'|'SF'|'PF'|'C'; secondary:'PG'|'SG'|'SF'|'PF'|'C'|null };
  overall?: number|null; winPct?: number|null;
  playStyle: string[]; gameModes: string[]; competitiveLevel: 'casual'|'competitive'|'elite';
};

const platforms = ['PS5','Xbox Series','PC','Switch','Other'] as const;
const positions = ['PG','SG','SF','PF','C'] as const;
const modeOptions = ['Pro-Am 5v5','Rec','Proving Ground','Park/City','Events','MyCareer'];

export default function StepNBA2K({ value, onChange }:{
  value: NBA2KState; onChange: (v: NBA2KState)=>void
}) {
  const set = <K extends keyof NBA2KState>(k:K, v:NBA2KState[K]) => onChange({ ...value, [k]: v });

  const toggleArray = (k: 'playStyle'|'gameModes', v:string) => {
    const cur = value[k]; const exists = cur.includes(v);
    set(k, exists ? cur.filter(x=>x!==v) : [...cur, v]);
  };

  return (
    <div className="protocol-form">
      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label">Platform</label>
          <select className="protocol-select" value={value.platform} onChange={e=>set('platform', e.target.value as any)}>
            {platforms.map(p=><option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="protocol-field">
          <label className="protocol-label">Allow Crossplay</label>
          <select className="protocol-select" value={value.allowsCrossplay ? 'yes':'no'} onChange={e=>set('allowsCrossplay', e.target.value==='yes')}>
            <option value="yes">Yes</option><option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label">Primary Position</label>
          <select className="protocol-select" value={value.positions.primary} onChange={e=>set('positions',{...value.positions, primary: e.target.value as any})}>
            {positions.map(p=><option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="protocol-field">
          <label className="protocol-label">Secondary Position</label>
          <select className="protocol-select" value={value.positions.secondary ?? ''} onChange={e=>set('positions',{...value.positions, secondary: (e.target.value || null) as any})}>
            <option value="">None</option>
            {positions.map(p=><option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label">Overall (optional)</label>
          <input className="protocol-input" type="number" min={60} max={99} value={value.overall ?? ''} onChange={e=>set('overall', e.target.value ? Number(e.target.value) : null)} />
        </div>
        <div className="protocol-field">
          <label className="protocol-label">Win % (optional)</label>
          <input className="protocol-input" type="number" min={0} max={100} value={value.winPct ?? ''} onChange={e=>set('winPct', e.target.value ? Number(e.target.value) : null)} />
        </div>
      </div>

      <div className="protocol-field">
        <label className="protocol-label">Play Style</label>
        <div>
          {['Team-first','ISO','Pick-and-Roll','Lockdown','Stretch','Inside','Perimeter'].map(tag=>(
            <span className="chip" key={tag}>
              <label><input type="checkbox" checked={value.playStyle.includes(tag)} onChange={()=>toggleArray('playStyle', tag)} /> {tag}</label>
            </span>
          ))}
        </div>
      </div>

      <div className="protocol-field">
        <label className="protocol-label">Game Modes</label>
        <div>
          {modeOptions.map(tag=>(
            <span className="chip" key={tag}>
              <label><input type="checkbox" checked={value.gameModes.includes(tag)} onChange={()=>toggleArray('gameModes', norm.mode(tag))} /> {tag}</label>
            </span>
          ))}
        </div>
        <div className="protocol-help">We auto-correct "Proven Ground" to "Proving Ground".</div>
      </div>

      <div className="protocol-field">
        <label className="protocol-label">Competitive Level</label>
        <select className="protocol-select" value={value.competitiveLevel} onChange={e=>set('competitiveLevel', e.target.value as any)}>
          <option value="casual">Casual</option><option value="competitive">Competitive</option><option value="elite">Elite</option>
        </select>
      </div>
    </div>
  );
}

import { useState } from 'react';

type Block = { day: string; start: string; end: string };
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function AvailabilityGrid({ value, onChange }:{
  value: Block[]; onChange: (v: Block[]) => void
}) {
  const [draft, setDraft] = useState<Block>({ day:'Mon', start:'20:00', end:'23:00' });
  const add = () => { onChange([...value, draft]); };
  const remove = (i:number) => { const copy=[...value]; copy.splice(i,1); onChange(copy); };

  return (
    <div className="protocol-field">
      <div className="protocol-row">
        <div className="protocol-field">
          <label className="protocol-label">Day</label>
          <select className="protocol-select" value={draft.day} onChange={e=>setDraft({...draft, day:e.target.value})}>
            {days.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="protocol-field">
          <label className="protocol-label">Start (local)</label>
          <input className="protocol-input" type="time" value={draft.start} onChange={e=>setDraft({...draft,start:e.target.value})}/>
        </div>
        <div className="protocol-field">
          <label className="protocol-label">End (local)</label>
          <input className="protocol-input" type="time" value={draft.end} onChange={e=>setDraft({...draft,end:e.target.value})}/>
        </div>
      </div>
      <div className="protocol-actions">
        <button type="button" className="protocol-btn" onClick={add}>Add slot</button>
      </div>
      <div aria-live="polite">
        {value.map((b, i)=>(
          <div key={`${b.day}-${i}`} className="chip">
            {b.day} {b.start}–{b.end}
            <button type="button" onClick={()=>remove(i)} aria-label={`Remove ${b.day} ${b.start}-${b.end}`}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

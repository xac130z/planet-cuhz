import React from 'react';

const items = [
  { title: 'Squad Finder', desc: 'Match by position, playstyle, region.' },
  { title: 'Verified Twitch', desc: 'Auth-only profiles, no burner spam.' },
  { title: 'Anti-Toxic Filters', desc: 'Report, mute, and block system.' },
  { title: 'Match IQ', desc: 'Signals from wins, clips, and comms.' },
];

export const Benefits: React.FC = () => (
  <section className="benefits" aria-label="Benefits">
    {items.map((b, i) => (
      <div className="benefit" key={i} tabIndex={0} role="group" aria-label={b.title}>
        <div className="benefit-title">{b.title}</div>
        <div className="benefit-desc">{b.desc}</div>
      </div>
    ))}
  </section>
);

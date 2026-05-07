import React from 'react';

type Props = { 
  active: 'AUTH' | 'ONBOARD' | 'NETWORK';
};

export const Stepper: React.FC<Props> = ({ active }) => (
  <ul className="phase-pills" role="list" aria-label="Protocol phases">
    {(['AUTH', 'ONBOARD', 'NETWORK'] as const).map(phase => (
      <li key={phase}>
        <span 
          className={`phase-pill ${active === phase ? 'is-active' : ''}`} 
          aria-current={active === phase ? 'step' : undefined}
        >
          {phase}
        </span>
      </li>
    ))}
  </ul>
);

export default Stepper;

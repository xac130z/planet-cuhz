import React from 'react';

export const PhaseIndicators: React.FC = () => (
  <ul className="phase-pills" role="list" aria-label="Protocol phases">
    <li>
      <button type="button" className="phase-pill is-active" aria-current="step">
        AUTH
      </button>
    </li>
    <li>
      <button type="button" className="phase-pill" aria-disabled="true">
        ONBOARD
      </button>
    </li>
    <li>
      <button type="button" className="phase-pill" aria-disabled="true">
        NETWORK
      </button>
    </li>
  </ul>
);

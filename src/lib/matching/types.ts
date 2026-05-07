export type AvailabilityBlock = { day:'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun'; start:string; end:string };
export type Positions = 'PG'|'SG'|'SF'|'PF'|'C';

export type ProfileLite = {
  user_id: string;
  updated_at?: string;
  display_name: string;
  onboarding_status: 'incomplete'|'complete'|string;
  profile: {
    global: {
      timezone: string; region: string; languages: string[]; mic: boolean;
      interests: string[]; consent_comms: boolean;
      email?: string|null; phone?: string|null;
      spiritual?: { zodiacChinese?: string; lifePathNumber?: string|null };
      handles?: { twitch?: string|null; discord?: string|null };
      availability: AvailabilityBlock[];
    };
    nba2k: {
      platform: 'PS5'|'Xbox Series'|'PC'|'Switch'|'Other';
      allowsCrossplay: boolean;
      positions: { primary: Positions; secondary: Positions | null };
      overall?: number|null; winPct?: number|null;
      playStyle: string[];
      gameModes: string[];
      competitiveLevel: 'casual'|'competitive'|'elite';
    };
  };
};

export type MatchRecord = {
  id: string;
  type: 'nba2k_pair'|'nba2k_squad5';
  member_ids: string[];
  score: number;
  explanation: string;
  position_coverage?: Record<Positions, number>;
  scheduled_overlap_minutes: number;
  status: 'new'|'pending_accept'|'mutual_accept'|'declined';
};

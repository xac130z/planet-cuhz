import { ProfileLite, Positions } from './types';
import { overlapMinutes, overlapScore } from './time';

function setContains<T>(arr: T[] | undefined | null, val: T) {
  return !!arr?.includes(val);
}

function playstyleSynergy(a: string[], b: string[]) {
  let score = 0;
  const exact = a.filter(x => b.includes(x)).length;
  score += exact * 6;
  // Simple complementary heuristic
  const complements: [string,string][] = [['Pick-and-Roll','Stretch'], ['ISO','Lockdown'], ['Inside','Perimeter']];
  for (const [x,y] of complements) {
    if (setContains(a, x) && setContains(b, y)) score += 3;
    if (setContains(a, y) && setContains(b, x)) score += 3;
  }
  return score;
}

function zodiacBonus(a?: string, b?: string) {
  if (!a || !b) return 0;
  const trines = [
    ['Rat','Dragon','Monkey'],
    ['Ox','Snake','Rooster'],
    ['Tiger','Horse','Dog'],
    ['Rabbit','Goat','Pig']
  ];
  const sameTrine = trines.some(t => t.includes(a) && t.includes(b));
  if (sameTrine) return 10;
  const opposites: Record<string,string> = { Rat:'Horse', Ox:'Goat', Tiger:'Monkey', Rabbit:'Rooster', Dragon:'Dog', Snake:'Pig', Horse:'Rat', Goat:'Ox', Monkey:'Tiger', Rooster:'Rabbit', Dog:'Dragon', Pig:'Snake' };
  if (opposites[a] === b) return -6;
  if (a === b) return 5;
  return 0;
}

function freshnessBoost(aUpdated?: string, bUpdated?: string) {
  let s = 0;
  const now = Date.now();
  for (const t of [aUpdated, bUpdated]) {
    if (!t) continue;
    if ((now - Date.parse(t)) <= 14 * 24 * 3600 * 1000) s += 3;
  }
  return Math.min(s, 6);
}

export function pairScore(a: ProfileLite, b: ProfileLite) {
  const A = a.profile, B = b.profile;
  // Hard filters
  if (!A.global.consent_comms || !B.global.consent_comms) return { score: 0, mins: 0 };
  const samePlatform = A.nba2k.platform === B.nba2k.platform;
  const bothCross = A.nba2k.allowsCrossplay && B.nba2k.allowsCrossplay;
  if (!samePlatform && !bothCross) return { score: 0, mins: 0 };

  // Position
  let pos = 0;
  if (A.nba2k.positions.primary !== B.nba2k.positions.primary) pos += 15;
  else if (A.nba2k.positions.secondary && A.nba2k.positions.secondary !== B.nba2k.positions.primary) pos += 8;

  // Modes overlap
  const sharedModes = A.nba2k.gameModes.filter(x => B.nba2k.gameModes.includes(x)).slice(0, 3).length;
  const modes = Math.min(sharedModes * 4, 12);

  // Playstyle
  const style = playstyleSynergy(A.nba2k.playStyle, B.nba2k.playStyle);

  // Overlap minutes
  const mins = overlapMinutes(A.global.availability, B.global.availability);
  const ov = overlapScore(mins);

  // Platform/Crossplay
  const plat = samePlatform ? 8 : bothCross ? 4 : -20;

  // Region
  const reg = A.global.region === B.global.region ? 6 : 0;

  // Mic
  const mic = (A.global.mic && B.global.mic) ? 5 : 0;

  // Language
  const lang = A.global.languages.some(x => B.global.languages.includes(x)) ? 3 : 0;

  // Interests (cap 10)
  const interests = Math.min(A.global.interests.filter(x => B.global.interests.includes(x)).length * 2, 10);

  // Freshness (cap 6)
  const fresh = freshnessBoost(a.updated_at, b.updated_at);

  // Spiritual
  const spirit = zodiacBonus(A.global.spiritual?.zodiacChinese, B.global.spiritual?.zodiacChinese);

  let score = pos + modes + style + ov + plat + reg + mic + lang + interests + fresh + spirit;
  score = Math.max(0, Math.min(100, score));
  return { score, mins };
}

export function coverageScore(members: ProfileLite[]) {
  const seen = new Set<Positions>();
  for (const m of members) {
    seen.add(m.profile.nba2k.positions.primary);
    if (m.profile.nba2k.positions.secondary) seen.add(m.profile.nba2k.positions.secondary as Positions);
  }
  const coverage: Record<Positions, number> = { PG:0, SG:0, SF:0, PF:0, C:0 };
  members.forEach(m => { coverage[m.profile.nba2k.positions.primary]++; });
  const full = (['PG','SG','SF','PF','C'] as Positions[]).every(p => seen.has(p));
  return { coverage, bonus: full ? 15 : 0, full };
}

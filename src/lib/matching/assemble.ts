import { ProfileLite } from './types';
import { pairScore, coverageScore } from './scoring';

// Build top pairs (>=60) then try to form best Squad5
export function buildSquad5(candidates: ProfileLite[]) {
  // Simple greedy: compute all pair scores, keep top, then expand
  const pairs: { a: ProfileLite; b: ProfileLite; score: number }[] = [];
  for (let i=0;i<candidates.length;i++) {
    for (let j=i+1;j<candidates.length;j++) {
      const { score } = pairScore(candidates[i], candidates[j]);
      if (score >= 60) pairs.push({ a: candidates[i], b: candidates[j], score });
    }
  }
  pairs.sort((x,y)=>y.score-x.score);

  // Try to assemble a five from the best pairs
  for (const p of pairs.slice(0, 50)) {
    const pool = candidates
      .filter(c => c.user_id !== p.a.user_id && c.user_id !== p.b.user_id)
      .slice(0, 50);
    // naive expand: pick top 3 by average pair score to A/B
    const scored = pool.map(c => {
      const s1 = pairScore(p.a, c).score;
      const s2 = pairScore(p.b, c).score;
      return { c, s: (s1 + s2)/2 };
    }).sort((x,y)=>y.s-x.s);
    const five = [p.a, p.b, ...scored.slice(0,3).map(x=>x.c)];
    if (five.length === 5) {
      const { coverage, bonus } = coverageScore(five);
      const avgPair = averagePairScore(five);
      const total = Math.min(100, Math.round(avgPair + bonus));
      return { members: five, coverage, total };
    }
  }
  return null;
}

function averagePairScore(members: ProfileLite[]) {
  let total = 0, count = 0;
  for (let i=0;i<members.length;i++) {
    for (let j=i+1;j<members.length;j++) {
      total += pairScore(members[i], members[j]).score;
      count++;
    }
  }
  return count ? total / count : 0;
}

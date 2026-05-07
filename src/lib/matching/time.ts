// Convert local availability blocks → UTC minutes-of-week vector and compute overlap
const dayIndex: Record<string, number> = { Mon:0, Tue:1, Wed:2, Thu:3, Fri:4, Sat:5, Sun:6 };

export function minutesOfWeek(day: string, hm: string) {
  const [h, m] = hm.split(':').map(Number);
  return (dayIndex[day] * 24 * 60) + h * 60 + m;
}

export function overlapMinutes(
  a: { day:string; start:string; end:string }[],
  b: { day:string; start:string; end:string }[]
) {
  // Simplified: treat times as same local TZ group; Phase 5 can add IANA→UTC conversions.
  let total = 0;
  for (const ab of a) {
    for (const bb of b) {
      if (ab.day !== bb.day) continue;
      const aStart = minutesOfWeek(ab.day, ab.start);
      const aEnd   = minutesOfWeek(ab.day, ab.end);
      const bStart = minutesOfWeek(bb.day, bb.start);
      const bEnd   = minutesOfWeek(bb.day, bb.end);
      const s = Math.max(aStart, bStart);
      const e = Math.min(aEnd, bEnd);
      if (e > s) total += (e - s);
    }
  }
  return total;
}

export function overlapScore(mins: number) {
  const h = mins / 60;
  if (h >= 8) return 16;
  if (h >= 4) return 12;
  if (h >= 2) return 8;
  return 0;
}

// Deno Deploy (Supabase Edge Function)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ProfileRow = {
  user_id: string; display_name: string; updated_at: string | null;
  onboarding_status: string; profile: any;
};

function minutesOverlap(a: any[], b: any[]) {
  const idx: Record<string, number> = { Mon:0, Tue:1, Wed:2, Thu:3, Fri:4, Sat:5, Sun:6 };
  const toMin = (d:string, t:string) => {
    const [h,m] = t.split(':').map(Number); return idx[d]*24*60 + h*60 + m;
  };
  let total = 0;
  for (const A of a) for (const B of b) {
    if (A.day !== B.day) continue;
    const s = Math.max(toMin(A.day, A.start), toMin(B.day, B.start));
    const e = Math.min(toMin(A.day, A.end), toMin(B.day, B.end));
    if (e > s) total += (e - s);
  }
  return total;
}

function zBonus(a?: string, b?: string) {
  if (!a || !b) return 0;
  const trines = [['Rat','Dragon','Monkey'],['Ox','Snake','Rooster'],['Tiger','Horse','Dog'],['Rabbit','Goat','Pig']];
  const sameTrine = trines.some(t=>t.includes(a)&&t.includes(b));
  if (sameTrine) return 10;
  const opp: Record<string,string> = { Rat:'Horse', Ox:'Goat', Tiger:'Monkey', Rabbit:'Rooster', Dragon:'Dog', Snake:'Pig', Horse:'Rat', Goat:'Ox', Monkey:'Tiger', Rooster:'Rabbit', Dog:'Dragon', Pig:'Snake' };
  if (opp[a]===b) return -6;
  if (a===b) return 5;
  return 0;
}

const languagesShared = (A:string[], B:string[]) => A.some(x=>B.includes(x));

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Require authentication - admin only
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: adminRole } = await serviceClient
      .from('admin_roles')
      .select('id')
      .eq('user_id', claimsData.claims.sub)
      .maybeSingle();

    if (!adminRole) {
      return new Response(
        JSON.stringify({ error: 'Forbidden - admin only' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = serviceClient;
    
    console.log('Fetching completed onboarding profiles...');
    const { data: users, error: fetchError } = await supabase
      .from('user_profiles')
      .select('user_id, display_name, updated_at, onboarding_status, profile')
      .eq('onboarding_status', 'complete');

    if (fetchError) throw fetchError;

    const rows = (users || []) as ProfileRow[];
    console.log(`Found ${rows.length} completed profiles`);

    type Pair = { a: ProfileRow; b: ProfileRow; score: number; explanation: string; mins: number };
    const pairs: Pair[] = [];

    for (let i=0;i<rows.length;i++){
      for (let j=i+1;j<rows.length;j++){
        const A = rows[i].profile, B = rows[j].profile;
        if (!A?.global?.consent_comms || !B?.global?.consent_comms) continue;

        const samePlatform = A.nba2k.platform === B.nba2k.platform;
        const bothCross = A.nba2k.allowsCrossplay && B.nba2k.allowsCrossplay;
        if (!samePlatform && !bothCross) continue;

        let score = 0;

        // Positions
        if (A.nba2k.positions.primary !== B.nba2k.positions.primary) score += 15;
        else if (A.nba2k.positions.secondary && A.nba2k.positions.secondary !== B.nba2k.positions.primary) score += 8;

        // Modes overlap
        const sharedModes = (A.nba2k.gameModes||[]).filter((x:string)=> (B.nba2k.gameModes||[]).includes(x)).slice(0,3).length;
        score += Math.min(sharedModes*4, 12);

        // Playstyle
        const exact = (A.nba2k.playStyle||[]).filter((x:string)=> (B.nba2k.playStyle||[]).includes(x)).length;
        score += exact * 6;

        // Overlap
        const mins = minutesOverlap(A.global.availability||[], B.global.availability||[]);
        score += mins >= 8*60 ? 16 : mins >= 4*60 ? 12 : mins >= 2*60 ? 8 : 0;

        // Platform/Crossplay
        score += samePlatform ? 8 : bothCross ? 4 : -20;

        // Region, Mic, Language
        if (A.global.region === B.global.region) score += 6;
        if (A.global.mic && B.global.mic) score += 5;
        if (languagesShared(A.global.languages||[], B.global.languages||[])) score += 3;

        // Interests cap 10
        const interest = (A.global.interests||[]).filter((x:string)=> (B.global.interests||[]).includes(x)).length;
        score += Math.min(interest*2, 10);

        // Freshness (cap 6)
        const now = Date.now();
        const freshA = rows[i].updated_at && (now - Date.parse(rows[i].updated_at!) <= 14*24*3600*1000) ? 3 : 0;
        const freshB = rows[j].updated_at && (now - Date.parse(rows[j].updated_at!) <= 14*24*3600*1000) ? 3 : 0;
        score += Math.min(freshA + freshB, 6);

        // Spiritual
        score += zBonus(A.global.spiritual?.zodiacChinese, B.global.spiritual?.zodiacChinese);

        score = Math.max(0, Math.min(100, score));
        if (score < 40) continue;

        const sharedModesStr = (A.nba2k.gameModes||[]).filter((x:string)=> (B.nba2k.gameModes||[]).includes(x)).slice(0,3).join(', ') || 'mixed';
        const why = [
          A.nba2k.positions.primary !== B.nba2k.positions.primary
            ? `Role fit: ${A.nba2k.positions.primary} + ${B.nba2k.positions.primary}`
            : `Secondary cover: ${A.nba2k.positions.secondary ?? '—'} complements ${B.nba2k.positions.primary}`,
          `Modes: ${sharedModesStr}`,
          `Overlap: ~${Math.round(mins/60)}h/wk`,
          `Platform/Region: ${A.nba2k.platform}${samePlatform?' (same)':''} • ${A.global.region}`,
          (A.global.mic && B.global.mic) ? `Comms: Mic-on; Lang: ${languagesShared(A.global.languages||[], B.global.languages||[]) ? 'shared' : 'mixed'}` : `Comms: Mic mixed`,
        ].join('\n');

        pairs.push({ a: rows[i], b: rows[j], score, explanation: why, mins });
      }
    }

    // Upsert top N pairs per user to matches
    console.log(`Computed ${pairs.length} total pairs`);
    const topPairs = pairs.sort((x,y)=>y.score-x.score).slice(0, 100);
    
    let inserted = 0;
    for (const p of topPairs) {
      const { error: upsertError } = await supabase.from('matches').upsert({
        type: 'nba2k_pair',
        member_ids: [p.a.user_id, p.b.user_id],
        score: Math.round(p.score),
        explanation: p.explanation,
        scheduled_overlap_minutes: p.mins,
        status: 'new'
      });
      if (!upsertError) inserted++;
    }

    console.log(`Inserted ${inserted} pair matches`);

    // Squad5 Assembly - assemble best squads from high-scoring pairs
    let squad5Count = 0;
    if (rows.length >= 5) {
      console.log('Attempting Squad5 assembly...');
      
      // Simple greedy: find best initial pair, then expand
      const highScorePairs = pairs.slice(0, 30); // Top 30 pairs as seed
      
      for (const seedPair of highScorePairs.slice(0, 5)) { // Try up to 5 seeds
        const baseTwoIds = [seedPair.a.user_id, seedPair.b.user_id];
        const available = rows.filter(r => !baseTwoIds.includes(r.user_id));
        
        if (available.length < 3) continue;
        
        // Score remaining players against the pair
        const scoredCandidates = available.map(candidate => {
          let avgScore = 0;
          let count = 0;
          
          // Score against each base member
          for (const baseUser of [seedPair.a, seedPair.b]) {
            const A = baseUser.profile;
            const B = candidate.profile;
            
            if (!A?.global?.consent_comms || !B?.global?.consent_comms) continue;
            
            const samePlat = A.nba2k.platform === B.nba2k.platform;
            const bothCross = A.nba2k.allowsCrossplay && B.nba2k.allowsCrossplay;
            if (!samePlat && !bothCross) continue;
            
            let s = 0;
            if (A.nba2k.positions.primary !== B.nba2k.positions.primary) s += 15;
            const sharedModes = (A.nba2k.gameModes||[]).filter((x:string)=> (B.nba2k.gameModes||[]).includes(x)).slice(0,3).length;
            s += Math.min(sharedModes*4, 12);
            
            avgScore += s;
            count++;
          }
          
          return {
            user: candidate,
            score: count > 0 ? avgScore / count : 0
          };
        }).sort((a, b) => b.score - a.score);
        
        // Take top 3 to form Squad5
        const squad5Members = [seedPair.a, seedPair.b, ...scoredCandidates.slice(0, 3).map(c => c.user)];
        
        if (squad5Members.length === 5) {
          // Calculate position coverage
          const coverage: Record<string, number> = { PG: 0, SG: 0, SF: 0, PF: 0, C: 0 };
          const seenPositions = new Set<string>();
          
          squad5Members.forEach(m => {
            const primary = m.profile?.nba2k?.positions?.primary;
            if (primary) {
              coverage[primary]++;
              seenPositions.add(primary);
              if (m.profile.nba2k.positions.secondary) {
                seenPositions.add(m.profile.nba2k.positions.secondary);
              }
            }
          });
          
          const fullCoverage = ['PG', 'SG', 'SF', 'PF', 'C'].every(p => seenPositions.has(p));
          const coverageBonus = fullCoverage ? 15 : 0;
          
          // Calculate average pair score (simplified)
          let totalPairScore = 0;
          let pairCount = 0;
          for (let i = 0; i < squad5Members.length; i++) {
            for (let j = i + 1; j < squad5Members.length; j++) {
              const pairScore = pairs.find(p => 
                (p.a.user_id === squad5Members[i].user_id && p.b.user_id === squad5Members[j].user_id) ||
                (p.b.user_id === squad5Members[i].user_id && p.a.user_id === squad5Members[j].user_id)
              )?.score || 50;
              totalPairScore += pairScore;
              pairCount++;
            }
          }
          
          const avgPairScore = pairCount > 0 ? totalPairScore / pairCount : 50;
          const finalScore = Math.min(100, Math.round(avgPairScore + coverageBonus));
          
          // Build explanation
          const roles = squad5Members.map(m => m.profile?.nba2k?.positions?.primary || '?').join(', ');
          const platforms = [...new Set(squad5Members.map(m => m.profile?.nba2k?.platform))].join('/');
          
          const explanation = [
            `Squad5 coverage: ${roles}`,
            `Platforms: ${platforms}`,
            fullCoverage ? '✓ Full position coverage (PG/SG/SF/PF/C)' : 'Partial coverage',
            `Avg pair score: ${Math.round(avgPairScore)}/100`,
          ].join('\n');
          
          // Upsert Squad5 match
          const { error: squad5Error } = await supabase.from('matches').upsert({
            type: 'nba2k_squad5',
            member_ids: squad5Members.map(m => m.user_id),
            score: finalScore,
            explanation,
            position_coverage: coverage,
            scheduled_overlap_minutes: 0, // Could calculate min overlap across all members
            status: 'new'
          });
          
          if (!squad5Error) {
            squad5Count++;
            console.log(`Created Squad5 match with score ${finalScore}`);
            if (squad5Count >= 3) break; // Limit to 3 squads per run
          }
        }
      }
      
      console.log(`Created ${squad5Count} Squad5 matches`);
    }

    console.log(`Total inserted: ${inserted} pairs, ${squad5Count} squads`);

    return new Response(
      JSON.stringify({ ok: true, pairs: topPairs.length, inserted, squad5: squad5Count }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Matcher error:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

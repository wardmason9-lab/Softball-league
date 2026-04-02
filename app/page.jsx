"use client";

import { useState, useMemo } from "react";

const TEAMS = ["BK","GW","YG","SH","PK","GS","SM","SB"];

const schedule = {
  "Week 1": [
    { id:"G1", home:"BK", away:"GW" },
    { id:"G2", home:"YG", away:"SH" }
  ]
};

function empty() {
  const o = {};
  TEAMS.forEach(t => o[t] = { w:0, l:0, rs:0, rga:0 });
  return o;
}

export default function Page() {
  const [week] = useState("Week 1");
  const [scores,setScores] = useState({});

  const standings = useMemo(() => {
    const s = empty();

    schedule["Week 1"].forEach(g => {
      const game = scores[g.id];
      if (!game) return;

      const h = Number(game.h || 0);
      const a = Number(game.a || 0);

      s[g.home].rs += h;
      s[g.home].rga += a;
      s[g.away].rs += a;
      s[g.away].rga += h;

      if (h > a) s[g.home].w++;
      else if (a > h) s[g.away].w++;
    });

    return Object.entries(s);
  }, [scores]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Softball League</h1>

      {schedule[week].map(g => (
        <div key={g.id} style={{ marginBottom: 10 }}>
          {g.away} vs {g.home}

          <input
            placeholder="Away"
            onChange={e =>
              setScores(p => ({
                ...p,
                [g.id]: { ...(p[g.id]||{}), a: e.target.value }
              }))
            }
          />

          <input
            placeholder="Home"
            onChange={e =>
              setScores(p => ({
                ...p,
                [g.id]: { ...(p[g.id]||{}), h: e.target.value }
              }))
            }
          />
        </div>
      ))}

      <h2>Standings</h2>
      {standings.map(([t,s]) => (
        <div key={t}>
          {t} {s.w}-{s.l} RS:{s.rs} RGA:{s.rga}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

const TEAMS = ["BK", "GW", "YG", "SH", "PK", "GS", "SM", "SB"];

const schedule = {
  "Week 1": [
    { id: "G1", home: "BK", away: "GW" },
    { id: "G2", home: "YG", away: "SH" },
    { id: "G3", home: "PK", away: "GS" },
    { id: "G4", home: "SM", away: "SB" }
  ],
  "Week 2": [
    { id: "G5", home: "BK", away: "SH" },
    { id: "G6", home: "GW", away: "YG" },
    { id: "G7", home: "PK", away: "SM" },
    { id: "G8", home: "GS", away: "SB" }
  ]
};

function emptyStats() {
  const obj: any = {};
  TEAMS.forEach(t => {
    obj[t] = { wins: 0, losses: 0, rs: 0, rga: 0 };
  });
  return obj;
}

export default function Page() {
  const [week, setWeek] = useState("Week 1");
  const [scores, setScores] = useState<any>({});

  const updateScore = (id: string, home: string, away: string, h: string, a: string) => {
    setScores((prev: any) => ({
      ...prev,
      [id]: { home, away, h, a }
    }));
  };

  const standings = useMemo(() => {
    const s = emptyStats();

    Object.values(schedule).forEach((games: any) => {
      games.forEach((g: any) => {
        const game = scores[g.id];
        if (!game) return;

        const hs = Number(game.h || 0);
        const as = Number(game.a || 0);

        s[g.home].rs += hs;
        s[g.home].rga += as;

        s[g.away].rs += as;
        s[g.away].rga += hs;

        if (hs > as) s[g.home].wins++;
        else if (as > hs) s[g.away].wins++;
        else {
          s[g.home].losses += 0;
          s[g.away].losses += 0;
        }
      });
    });

    return Object.entries(s).sort((a: any, b: any) => b[1].wins - a[1].wins);
  }, [scores]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Softball League</h1>

      {/* WEEK SELECT */}
      <div style={{ marginBottom: 20 }}>
        {Object.keys(schedule).map(w => (
          <button key={w} onClick={() => setWeek(w)} style={{ marginRight: 10 }}>
            {w}
          </button>
        ))}
      </div>

      {/* GAMES */}
      <h2>{week}</h2>
      {schedule[week as keyof typeof schedule].map((g: any) => (
        <div key={g.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <div>
            {g.away} vs {g.home}
          </div>

          <input
            placeholder="Away"
            style={{ width: 60, marginRight: 10 }}
            value={scores[g.id]?.a || ""}
            onChange={(e) =>
              updateScore(g.id, g.home, g.away, scores[g.id]?.h || "", e.target.value)
            }
          />

          <input
            placeholder="Home"
            style={{ width: 60 }}
            value={scores[g.id]?.h || ""}
            onChange={(e) =>
              updateScore(g.id, g.home, g.away, e.target.value, scores[g.id]?.a || "")
            }
          />
        </div>
      ))}

      {/* STANDINGS */}
      <h2>Standings</h2>
      {standings.map(([team, st]: any) => (
        <div key={team}>
          {team} — {st.wins}-{st.losses} | RS:{st.rs} RGA:{st.rga}
        </div>
      ))}
    </div>
  );
}

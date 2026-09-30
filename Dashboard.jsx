import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import FinanceForm from "./FinanceForm.jsx";
import ScoreChart from "./ScoreChart.jsx";
import UtilizationPie from "./UtilizationPie.jsx";
import AdvisorPanel from "./AdvisorPanel.jsx";

const tone = { Excellent: "good", Good: "good", Fair: "mid", Poor: "bad" };

export default function Dashboard({ onLogout }) {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const [advice, setAdvice] = useState(null);

  const load = useCallback(() => api("/dashboard").then(setD).catch((e) => setErr(e.message)), []);
  useEffect(() => { load(); }, [load]);

  async function saved() { setAdvice(null); await load(); } // new data makes old advice stale

  if (err) return <div className="wrap"><p className="error">{err}</p></div>;
  if (!d) return <div className="wrap"><p>Loading…</p></div>;
  const l = d.latest;

  return (
    <div className="wrap">
      <header className="bar">
        <h1>Credit Assistant</h1>
        <div><span>{d.name}</span><button className="link" onClick={onLogout}>Sign out</button></div>
      </header>

      {!l ? (
        <section className="card empty">
          <h2>Welcome, {d.name}</h2>
          <p>Add your credit score and monthly figures to see your dashboard.</p>
        </section>
      ) : (
        <>
          <section className="hero card">
            <div className="score">
              <b>{l.credit_score}</b>
              <span className={`badge ${tone[l.category]}`}>{l.category}</span>
              {l.improvement !== null && (
                <span className={l.improvement >= 0 ? "delta up" : "delta down"}>
                  {l.improvement >= 0 ? "+" : ""}{l.improvement} since last update
                </span>
              )}
              <small>{l.points_to_excellent ? `${l.points_to_excellent} points to Excellent (750)` : "You are in the Excellent range"}</small>
            </div>
            <div className="metrics">
              <div><b>{l.debt_to_income}%</b><span>Debt-to-income</span></div>
              <div><b>{l.utilization}%</b><span>Card utilization</span></div>
              <div><b>{l.missed_payments}</b><span>Missed payments</span></div>
            </div>
          </section>

          <section className="cols">
            <div className="card"><h2>Score history</h2><ScoreChart data={d.history} /></div>
            <div className="card"><h2>Credit limit usage</h2><UtilizationPie data={d.utilization_pie} /></div>
          </section>

          <section className="card">
            <h2>What is holding your score back</h2>
            {d.bottlenecks.length === 0 ? <p>No bottlenecks found in the numbers you entered.</p> : (
              <ul className="bottlenecks">
                {d.bottlenecks.map((b) => <li key={b.title}><b>{b.title}</b><span>{b.detail}</span></li>)}
              </ul>
            )}
          </section>

          <AdvisorPanel advice={advice} setAdvice={setAdvice} />
        </>
      )}

      <FinanceForm onSaved={saved} hasData={!!l} />
    </div>
  );
}

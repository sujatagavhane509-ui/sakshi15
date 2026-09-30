import { useState } from "react";
import { api } from "../api.js";

export default function AdvisorPanel({ advice, setAdvice }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function ask() {
    setErr(""); setBusy(true);
    try { setAdvice(await api("/advice", { method: "POST" })); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  }

  return (
    <section className="card">
      <h2>Your plan to reach Excellent</h2>
      {!advice && <p className="muted">The AI advisor reads your latest numbers and writes a 5-step plan for Indian banking norms.</p>}
      {advice && (
        <>
          <p>{advice.summary}</p>
          <ol className="steps">{advice.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          <small className="muted">{advice.source === "gemini" ? "Written by Gemini AI." : "Gemini is unavailable, so this plan comes from standard rules."} General guidance, not financial advice.</small>
        </>
      )}
      {err && <p className="error" role="alert">{err}</p>}
      <div><button className="btn" onClick={ask} disabled={busy}>{busy ? "Analysing…" : advice ? "Refresh advice" : "Get my plan"}</button></div>
    </section>
  );
}

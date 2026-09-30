import { useState } from "react";
import { api } from "../api.js";

const fields = [
  ["credit_score", "Credit score (300-900)", 300, 900],
  ["monthly_income", "Monthly income (₹)", 1],
  ["monthly_expenses", "Monthly expenses (₹)", 0],
  ["monthly_debt_payments", "Total monthly EMIs (₹)", 0],
  ["credit_limit", "Total credit card limit (₹)", 0],
  ["credit_used", "Credit card balance used (₹)", 0],
  ["missed_payments", "Missed payments (last 2 years)", 0],
];

export default function FinanceForm({ onSaved, hasData }) {
  const [v, setV] = useState({});
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const body = Object.fromEntries(fields.map(([k]) => [k, Number(v[k] ?? 0)]));
      await api("/records", { method: "POST", body });
      await onSaved();
    } catch (e2) { setErr(e2.message); }
    setBusy(false);
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>{hasData ? "Update your figures" : "Your financial details"}</h2>
      <div className="grid">
        {fields.map(([k, label, min, max]) => (
          <label key={k}>{label}
            <input type="number" min={min} max={max} value={v[k] ?? ""} required
              onChange={(e) => setV({ ...v, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      {err && <p className="error" role="alert">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "Saving…" : hasData ? "Save update" : "Save and build dashboard"}</button>
    </form>
  );
}

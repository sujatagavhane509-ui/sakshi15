import { useState } from "react";
import { api, auth } from "../api.js";

export default function AuthPage({ onDone }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const body = mode === "login" ? { email: f.email, password: f.password } : f;
      const res = await api(mode === "login" ? "/auth/login" : "/auth/register", { method: "POST", body });
      auth.save(res.access_token, res.name);
      onDone();
    } catch (e2) { setErr(e2.message); }
    setBusy(false);
  }

  return (
    <div className="auth">
      <div className="auth-intro">
        <h1>Credit Assistant</h1>
        <p>Enter your numbers, see what is holding your score back, and get a step-by-step plan to reach 750+.</p>
      </div>
      <form className="card auth-form" onSubmit={submit}>
        <h2>{mode === "login" ? "Sign in" : "Create your account"}</h2>
        {mode === "register" && <label>Name<input value={f.name} onChange={set("name")} required /></label>}
        <label>Email<input type="email" value={f.email} onChange={set("email")} required /></label>
        <label>Password<input type="password" minLength={8} value={f.password} onChange={set("password")} required />
          {mode === "register" && <small>At least 8 characters</small>}
        </label>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
        <button type="button" className="link" onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }}>
          {mode === "login" ? "New here? Create an account" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}

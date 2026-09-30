import { useState } from "react";
import { auth } from "./api.js";
import AuthPage from "./components/AuthPage.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [signedIn, setSignedIn] = useState(!!auth.token);
  if (!signedIn) return <AuthPage onDone={() => setSignedIn(true)} />;
  return <Dashboard onLogout={() => { auth.clear(); setSignedIn(false); }} />;
}

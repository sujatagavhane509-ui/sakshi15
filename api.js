const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const auth = {
  get token() { return localStorage.getItem("ca_token"); },
  save(t, name) { localStorage.setItem("ca_token", t); localStorage.setItem("ca_name", name); },
  clear() { localStorage.removeItem("ca_token"); localStorage.removeItem("ca_name"); },
};

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && auth.token) { auth.clear(); window.location.reload(); }
  if (!res.ok) {
    const d = data.detail;
    throw new Error(typeof d === "string" ? d : Array.isArray(d) ? d.map((e) => e.msg).join(". ") : "Something went wrong");
  }
  return data;
}

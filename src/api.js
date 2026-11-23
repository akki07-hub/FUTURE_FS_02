// Small client for the Mini CRM Express API.
// The API address comes from VITE_API_URL at build time (see .env.example).
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Can't reach the server. It may be waking up, so try again in a moment.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export const api = {
  listLeads: () => request("/api/leads"),
  addLead: (lead) => request("/api/leads", { method: "POST", body: JSON.stringify(lead) }),
  updateStatus: (id, status) =>
    request(`/api/leads/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

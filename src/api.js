// Mini CRM data layer — saves leads in the browser's localStorage.
// No server or account needed: each visitor gets their own copy of the data,
// which stays after reloading the page. The functions are async so the app
// could switch to a real backend later without changing App.jsx.

const STORAGE_KEY = "mini-crm:leads:v1";
const STATUSES = ["new", "contacted", "converted"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SAMPLE_LEADS = [
  { name: "Priya Sharma", email: "priya@example.com", status: "new" },
  { name: "Rahul Verma", email: "rahul@example.com", status: "contacted" },
  { name: "Ananya Reddy", email: "ananya@example.com", status: "converted" },
  { name: "Karthik Rao", email: "karthik@example.com", status: "new" },
  { name: "Sneha Patel", email: "sneha@example.com", status: "contacted" },
];

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sampleData() {
  const now = Date.now();
  // Oldest sample first so the newest appears at the top
  return SAMPLE_LEADS.map((lead, i) => ({
    id: makeId(),
    ...lead,
    created_at: new Date(now - (SAMPLE_LEADS.length - i) * 60_000).toISOString(),
  }));
}

// In-memory fallback for browsers that block storage (e.g. some private modes)
let memoryLeads = null;

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seeded = sampleData();
      writeAll(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    if (!memoryLeads) memoryLeads = sampleData();
    return memoryLeads;
  }
}

function writeAll(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    memoryLeads = leads;
  }
}

const byNewest = (a, b) => (a.created_at < b.created_at ? 1 : -1);

export const api = {
  async listLeads() {
    return [...readAll()].sort(byNewest);
  },

  async addLead({ name, email }) {
    name = String(name ?? "").trim();
    email = String(email ?? "").trim().toLowerCase();
    if (!name || !email) throw new Error("Name and email are required.");
    if (name.length > 120) throw new Error("Name is too long.");
    if (!EMAIL_RE.test(email)) throw new Error("Enter a valid email address.");

    const lead = { id: makeId(), name, email, status: "new", created_at: new Date().toISOString() };
    writeAll([lead, ...readAll()]);
    return lead;
  },

  async updateStatus(id, status) {
    if (!STATUSES.includes(status)) throw new Error("Status must be new, contacted or converted.");
    const leads = readAll();
    const index = leads.findIndex((lead) => lead.id === id);
    if (index === -1) throw new Error("Lead not found.");
    leads[index] = { ...leads[index], status };
    writeAll(leads);
    return leads[index];
  },

  async resetDemo() {
    const seeded = sampleData();
    writeAll(seeded);
    return [...seeded].sort(byNewest);
  },
};

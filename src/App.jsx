import { useEffect, useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./App.css";
import { api } from "./api";

const STATUS_FLOW = {
  new: "contacted",
  contacted: "converted",
  converted: "new",
};

const COLORS = ["#3b82f6", "#facc15", "#22c55e"];

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const data = await api.listLeads();
      setLeads(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function addLead(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage("Enter both name and email before adding a lead.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      await api.addLead({ name: name.trim(), email: email.trim() });
    } catch (err) {
      setMessage(`Lead was not saved. ${err.message}`);
      return;
    } finally {
      setIsSaving(false);
    }

    setName("");
    setEmail("");
    setPage("leads");
    fetchLeads();
  }

  async function resetDemo() {
    if (!window.confirm("Reset the demo? Your leads will be replaced with the sample leads.")) return;
    setLeads(await api.resetDemo());
    setMessage("");
  }

  async function updateStatus(id, current) {
    try {
      const updated = await api.updateStatus(id, STATUS_FLOW[current] || "new");
      setLeads((prev) => prev.map((lead) => (lead.id === id ? updated : lead)));
    } catch (err) {
      setMessage(`Status was not updated. ${err.message}`);
    }
  }

  const stats = useMemo(() => {
    const total = leads.length;
    const contacted = leads.filter((lead) => lead.status === "contacted").length;
    const converted = leads.filter((lead) => lead.status === "converted").length;
    const fresh = leads.filter((lead) => lead.status === "new").length;

    return { total, contacted, converted, fresh };
  }, [leads]);

  const chartData = [
    { name: "New", value: stats.fresh },
    { name: "Contacted", value: stats.contacted },
    { name: "Converted", value: stats.converted },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="brand">Mini CRM</h1>

        <nav className="nav-list" aria-label="CRM sections">
          {["dashboard", "leads", "analytics"].map((item) => (
            <button
              className={`nav-item ${page === item ? "active" : ""}`}
              key={item}
              onClick={() => setPage(item)}
              type="button"
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Lead Workspace &middot; saved in this browser</p>
            <h2>{page[0].toUpperCase() + page.slice(1)}</h2>
          </div>

          <button className="logout-btn" onClick={resetDemo} type="button">
            Reset Demo
          </button>
        </header>

        {message && (
          <p className="status-message" role="alert">
            {message}
          </p>
        )}
        {isLoading && !message && (
          <p className="status-message" role="status">
            Loading leads…
          </p>
        )}

        {(page === "dashboard" || page === "analytics") && (
          <section className="stats-grid" aria-label="Lead statistics">
            <StatCard label="Total Leads" value={stats.total} tone="blue" />
            <StatCard label="Contacted" value={stats.contacted} tone="yellow" />
            <StatCard label="Converted" value={stats.converted} tone="green" />
          </section>
        )}

        {(page === "dashboard" || page === "analytics") && (
          <section className="panel analytics-panel">
            <div>
              <p className="eyebrow">Overview</p>
              <h3>Lead Analytics</h3>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    label
                    outerRadius={100}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {(page === "dashboard" || page === "leads") && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Pipeline</p>
                <h3>Add Lead</h3>
              </div>
            </div>

            <form className="lead-form" onSubmit={addLead}>
              <input
                aria-label="Lead name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                type="text"
                value={name}
              />

              <input
                aria-label="Lead email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                type="email"
                value={email}
              />

              <button className="primary-btn" disabled={isSaving} type="submit">
                {isSaving ? "Adding…" : "Add"}
              </button>
            </form>
          </section>
        )}

        {(page === "dashboard" || page === "leads") && (
          <section className="leads-grid">
            {leads.length === 0 ? (
              <div className="empty-state">
                <h3>No leads yet</h3>
                <p>Add your first lead to start tracking the pipeline.</p>
              </div>
            ) : (
              leads.map((lead) => (
                <article className="lead-card" key={lead.id}>
                  <div className="lead-card-header">
                    <div>
                      <h3>{lead.name}</h3>
                      <p>{lead.email}</p>
                    </div>

                    <span className={`status-pill ${lead.status}`}>
                      {lead.status}
                    </span>
                  </div>

                  <button
                    className="secondary-btn"
                    onClick={() => updateStatus(lead.id, lead.status)}
                    type="button"
                  >
                    Update Status
                  </button>
                </article>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

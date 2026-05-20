
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [leads, setLeads] = useState([]);
 const [page, setPage] = useState("dashboard");

useEffect(() => {
  fetchLeads();
}, []);

  async function fetchLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    setLeads(data || []);
  }

  async function addLead() {
    if (!name || !email) return;

    await supabase.from("leads").insert([
      {
        name,
        email,
        status: "new",
      },
    ]);

    setName("");
    setEmail("");

    fetchLeads();
  }

  async function updateStatus(id, current) {
    const next =
      current === "new"
        ? "contacted"
        : current === "contacted"
        ? "converted"
        : "new";

    await supabase
      .from("leads")
      .update({ status: next })
      .eq("id", id);

    fetchLeads();
  }

  const total = leads.length;
  const contacted = leads.filter(
    (lead) => lead.status === "contacted"
  ).length;

  const converted = leads.filter(
    (lead) => lead.status === "converted"
  ).length;
const data = [
  {
    name: "New",
    value: leads.filter(
      (lead) => lead.status === "new"
    ).length,
  },
  {
    name: "Contacted",
    value: leads.filter(
      (lead) => lead.status === "contacted"
    ).length,
  },
  {
    name: "Converted",
    value: leads.filter(
      (lead) => lead.status === "converted"
    ).length,
  },
];

const COLORS = [
  "#3b82f6",
  "#facc15",
  "#22c55e",
];
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-black text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#111827] p-6 border-r border-gray-800">
       <h1 className="text-4xl font-extrabold mb-10 text-blue-400 drop-shadow-[0_0_15px_#3b82f6]">
  Mini CRM
</h1>

        <div className="space-y-4 text-gray-300">
          <p
  onClick={() => setPage("dashboard")}
  className="hover:text-white cursor-pointer"
>
  Dashboard
</p>

          <p
  onClick={() => setPage("leads")}
  className="hover:text-white cursor-pointer"
>
  Leads
</p>

        <p
  onClick={() => setPage("analytics")}
  className="hover:text-white cursor-pointer"
>
  Analytics
</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-8">
      <div className="flex justify-end mb-6">
  <button
    onClick={() => supabase.auth.signOut()}
    className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.7)]"
  >
    Logout
  </button>
</div>
        {/* Top Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1e293b]/80 backdrop-blur-lg p-6 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-blue-500/20">
            <h2 className="text-gray-400 mb-2">
              Total Leads
            </h2>

            <p className="text-4xl font-bold">
              {total}
            </p>
          </div>

          <div className="bg-[#1e293b]/80 backdrop-blur-lg p-6 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-blue-500/20">
            <h2 className="text-gray-400 mb-2">
              Contacted
            </h2>

            <p className="text-4xl font-bold text-yellow-400">
              {contacted}
            </p>
          </div>

          <div className="bg-[#1e293b]/80 backdrop-blur-lg p-6 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.3)] border border-blue-500/20">
            <h2 className="text-gray-400 mb-2">
              Converted
            </h2>

            <p className="text-4xl font-bold text-green-400">
              {converted}
            </p>
          </div>
        </div>
<div className="bg-[#1e293b] p-6 rounded-2xl mb-8">

  <h2 className="text-2xl font-bold mb-4">
    Lead Analytics
  </h2>

  <PieChart width={300} height={300}>
    <Pie
      data={data}
      cx={150}
      cy={150}
      outerRadius={100}
      dataKey="value"
      label
    >
      {data.map((entry, index) => (
        <Cell
          key={index}
          fill={COLORS[index]}
        />
      ))}
    </Pie>

    <Tooltip />
  </PieChart>

</div>
        {/* Add Lead */}
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-lg mb-8">

          <h2 className="text-2xl font-semibold mb-4">
            Add Lead
          </h2>

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] border border-gray-700 p-3 rounded-lg w-full"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] border border-gray-700 p-3 rounded-lg w-full"
            />

            <button
              onClick={addLead}
              className="bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.7)]"
            >
              Add
            </button>

          </div>
        </div>

        {/* Leads */}
        <div className="grid md:grid-cols-2 gap-6">

          {leads.map((lead) => (

            <div
              key={lead.id}
              className="bg-[#1e293b] p-6 rounded-2xl shadow-lg"
            >

              <div className="flex justify-between items-center mb-4">

                <div>
                  <h2 className="text-xl font-bold">
                    {lead.name}
                  </h2>

                  <p className="text-gray-400">
                    {lead.email}
                  </p>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    lead.status === "new"
                      ? "bg-blue-500"
                      : lead.status === "contacted"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {lead.status}
                </span>

              </div>

              <button
                onClick={() =>
                  updateStatus(
                    lead.id,
                    lead.status
                  )
                }
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Update Status
              </button>

            </div>

          ))}
        </div>
      </div>
    </div>
  );
} 
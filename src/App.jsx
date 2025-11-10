import React, { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { FaMoon, FaSun, FaDownload, FaUserFriends, FaDonate } from "react-icons/fa";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const initialData = [
  { month: "Jan", amount: 5000, donors: 12 },
  { month: "Feb", amount: 4200, donors: 9 },
  { month: "Mar", amount: 7200, donors: 18 },
  { month: "Apr", amount: 8800, donors: 22 },
  { month: "May", amount: 6500, donors: 15 },
  { month: "Jun", amount: 9400, donors: 25 },
  { month: "Jul", amount: 11000, donors: 28 },
  { month: "Aug", amount: 7600, donors: 16 },
  { month: "Sep", amount: 8200, donors: 19 },
  { month: "Oct", amount: 10200, donors: 24 },
  { month: "Nov", amount: 9000, donors: 20 },
  { month: "Dec", amount: 12500, donors: 30 },
];

export default function App() {
  const [data] = useState(initialData);
  const [monthsView, setMonthsView] = useState(12);
  const [search, setSearch] = useState("");

  // ✅ Improved dark mode logic
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      console.log("🌙 Dark mode ON");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      console.log("☀️ Light mode ON");
    }
  }, [dark]);

  const displayedData = useMemo(() => {
    const sliced = data.slice(-monthsView);
    if (!search.trim()) return sliced;
    return sliced.filter((d) => d.month.toLowerCase().includes(search.toLowerCase()));
  }, [data, monthsView, search]);

  const totals = useMemo(() => {
    const totalDonations = data.reduce((s, d) => s + d.amount, 0);
    const totalDonors = data.reduce((s, d) => s + d.donors, 0);
    const avgDonation = totalDonations / (totalDonors || 1);
    return { totalDonations, totalDonors, avgDonation };
  }, [data]);

  function exportCSV(rows) {
    const headers = ["Month", "Amount", "Donors"];
    const csv = [headers.join(","), ...rows.map((r) => [r.month, r.amount, r.donors].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const peakMonth = useMemo(
    () => data.reduce((p, c) => (c.amount > p.amount ? c : p), data[0]).month,
    [data]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:to-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Donation Tracking Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Colorful glow theme — demo data
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur rounded-full px-3 py-1 shadow-glow-sm">
              <FaDonate className="text-pink-500" />
              <div className="text-xs text-gray-700 dark:text-gray-200">Live Demo</div>
            </div>

            {/* 🌙 Toggle button */}
            <button
              onClick={() => setDark((prev) => !prev)}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md transition"
            >
              {dark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-pink-500" />}
            </button>
          </div>
        </motion.header>

        {/* Cards */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
          <Card title="Total Donations" value={`₹${totals.totalDonations.toLocaleString()}`} subtitle="Sum of all donations" icon={<FaDonate className="text-pink-500" />} />
          <Card title="Number of Donors" value={totals.totalDonors} subtitle="Unique donor count" icon={<FaUserFriends className="text-blue-glow" />} />
          <Card title="Average Donation" value={`₹${Math.round(totals.avgDonation).toLocaleString()}`} subtitle="Average per donor" icon={<span>₹</span>} />
        </motion.section>

        {/* Filters */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <select
              value={monthsView}
              onChange={(e) => setMonthsView(Number(e.target.value))}
              className="rounded-md border px-3 py-2 bg-white dark:bg-gray-800 text-sm"
            >
              <option value={12}>Last 12 months</option>
              <option value={6}>Last 6 months</option>
              <option value={3}>Last 3 months</option>
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search month..."
              className="px-3 py-2 rounded-md border bg-white dark:bg-gray-800 text-sm"
            />
          </div>
          <button
            onClick={() => exportCSV(displayedData)}
            className="px-3 py-2 rounded-md bg-gradient-to-r from-pink-500 to-blue-glow text-white hover:opacity-95 flex items-center gap-2"
          >
            <FaDownload /> Export CSV
          </button>
        </div>

        {/* Charts */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="p-6 bg-white/60 dark:bg-gray-900 rounded-2xl shadow-lg border border-white/5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Donation Trend
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  Peak: <strong className="text-gray-700 dark:text-gray-100">{peakMonth}</strong>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={displayedData}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ff6ec7" stopOpacity={1} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2ff" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="url(#grad1)" strokeWidth={3} dot={{ r: 4, stroke: "#fff", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sidebar Table */}
          <aside className="lg:col-span-1">
            <div className="p-6 bg-white/60 dark:bg-gray-900 rounded-2xl shadow-lg border border-white/5 mb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Donor Table</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-500 border-b">
                      <th className="py-2">Month</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Donors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedData.map((row, idx) => (
                      <tr key={row.month} className={`border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 ${idx % 2 === 0 ? "bg-white/50 dark:bg-gray-900/40" : ""}`}>
                        <td className="py-2 text-gray-800 dark:text-gray-100">{row.month}</td>
                        <td className="py-2 text-gray-800 dark:text-gray-100">₹{row.amount.toLocaleString()}</td>
                        <td className="py-2 text-gray-800 dark:text-gray-100">{row.donors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 mb-4"></div>
          Built with ❤️ • Deadline: 12 Nov 2025
        </footer>
      </div>
    </div>
  );
}

// 🔹 Reusable Card Component
function Card({ title, value, subtitle, icon }) {
  return (
    <div className="p-6 bg-white/70 dark:bg-gray-800/60 backdrop-blur rounded-2xl shadow-glow-sm border border-transparent">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-600 dark:text-gray-300">{title}</div>
          <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
          <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
        </div>
        <div className="p-3 bg-white/80 rounded-xl shadow-sm">{icon}</div>
      </div>
    </div>
  );
}

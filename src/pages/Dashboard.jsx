import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [statistics, setStatistics] = useState([]);
  const [dashboard, setDashboard] = useState({});

  async function getDashboard() {
    const response = await apiFetch("/transaksi/statistics");
    const result = await response.json();

    setDashboard({
      totalMenu: result.data.totalMenu,
      totalUser: result.data.totalUser,
      totalTransaction: result.data.totalTransaction,
      totalIncome: result.data.totalIncome,
      todayTransaction: result.data.todayTransaction,
      todayIncome: result.data.todayIncome,
      myTransaction: result.data.myTransaction,
    });

    setStatistics(
      result.data.statistics.map((item) => ({
        ...item,
        total_income: Number(item.total_income),
      })),
    );
  }

  useEffect(() => {
    getDashboard();
  }, []);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "Rp 0";
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">{user?.role === "admin" ? "Overview keseluruhan sistem" : "Ringkasan aktivitas harian kamu"}</p>
      </div>

      {user?.role === "admin" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Total</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Menu</p>
              <h2 className="text-3xl font-bold text-slate-800">{dashboard.totalMenu || 0}</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-12 0v1z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Total</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total User</p>
              <h2 className="text-3xl font-bold text-slate-800">{dashboard.totalUser || 0}</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Total</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Transaction</p>
              <h2 className="text-3xl font-bold text-slate-800">{dashboard.totalTransaction || 0}</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Total</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Income</p>
              <h2 className="text-2xl font-bold text-slate-800">{formatCurrency(dashboard.totalIncome)}</h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Income Statistics</h3>
                <p className="text-sm text-slate-500 mt-1">Grafik pendapatan per periode</p>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "13px",
                      padding: "12px",
                    }}
                    formatter={(value) => [formatCurrency(value), "Income"]}
                    labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
                    cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
                  />
                  <Bar dataKey="total_income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Hari Ini</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Today's Transaction</p>
              <h2 className="text-3xl font-bold text-slate-800">{dashboard.todayTransaction || 0}</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Hari Ini</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Today's Income</p>
              <h2 className="text-2xl font-bold text-slate-800">{formatCurrency(dashboard.todayIncome)}</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Baru</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">New Transaction</p>
              <h2 className="text-3xl font-bold text-slate-800">{dashboard.myTransaction || 0}</h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Income Statistics</h3>
                <p className="text-sm text-slate-500 mt-1">Grafik pendapatan per periode</p>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stro eDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "13px",
                      padding: "12px",
                    }}
                    formatter={(value) => [formatCurrency(value), "Income"]}
                    labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
                    cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
                  />
                  <Bar dataKey="total_income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

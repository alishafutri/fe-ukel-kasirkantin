import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [statistics, setStatistics] = useState([]);
  const [dashboard, setDashboard] = useState({});

  async function getDashboard() {
    try {
      const response = await apiFetch("/transaksi/statistics");
      const result = await response.json();

      setDashboard(result.data);

      setStatistics(
        result.data.statistics.map((item) => ({
          ...item,
          total_income: Number(item.total_income),
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {user?.role === "admin" ? (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-lg shadow">
              <p className="text-gray-500">Total Menu</p>
              <h2 className="text-3xl font-bold">{dashboard.totalMenu}</h2>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <p className="text-gray-500">Total User</p>
              <h2 className="text-3xl font-bold">{dashboard.totalUser}</h2>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <p className="text-gray-500">Total Transaction</p>
              <h2 className="text-3xl font-bold">{dashboard.totalTransaction}</h2>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <p className="text-gray-500">Total Income</p>
              <h2 className="text-3xl font-bold text-green-600">Rp {dashboard.totalIncome?.toLocaleString("id-ID")}</h2>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Statistik Pendapatan</h2>

            <BarChart width={900} height={350} data={statistics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_income" fill="#16a34a" />
            </BarChart>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-lg shadow">
              <p className="text-gray-500">Today's Transaction</p>
              <h2 className="text-3xl font-bold">{dashboard.todayTransaction}</h2>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <p className="text-gray-500">Today's Income</p>
              <h2 className="text-3xl font-bold text-green-600">Rp {dashboard.todayIncome?.toLocaleString("id-ID")}</h2>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <p className="text-gray-500">My Transaction</p>
              <h2 className="text-3xl font-bold">{dashboard.myTransaction}</h2>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Riwayat Pendapatan Saya</h2>

            <BarChart data={statistics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_income" fill="#16a34a" />
            </BarChart>
          </div>
        </>
      )}
    </>
  );
}

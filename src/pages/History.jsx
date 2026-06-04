import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5";
import { resume } from "react-dom/server";

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [rangeData, setRangeData] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTransactions();
  }, [currentPage, limit, sortBy, order, search]);

  async function getTransactions() {
    try {
      const response = await apiFetch(`/transaksi?page=${currentPage}&limit=${limit}&sortBy=${sortBy}&order=${order}&id=${search}`);
      const result = await response.json();

      setTransactions(result?.data?.data);
      setTotalPage(result.data.totalPage);
      setTotalData(result.data.total);
      setRangeData(result.data.rangeData);
    } catch (error) {
      console.log(error);
    }
  }

  async function exportExcel() {
    try {
        const response = await apiFetch('/transaksi/export/excel');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.xlsx";
        a.click();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.log(error);
    }
  }

  async function exportPDF() {
    try {
        const response = await apiFetch('/transaksi/export/pdf');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.pdf";
        a.click();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.log(error);
    }
  }

  async function deleteTransaction(id) {
    const confirmDelete = window.confirm("anda yakin ingin menghapus ini?");
    if (!confirmDelete) return;
    try {
      await apiFetch(`/transaksi/${id}`, {
        method: "DELETE",
      });

      getTransactions();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-slate-800">History Transaksi</h1>
        <div className="flex gap-2">
            <button onClick={exportExcel} className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all">Export Excel</button>
            <button onClick={exportPDF} className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all">Export PDF</button>
            <input type="number" placeholder="Cari ID Transaksi" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1);}} className="border border-slate-200 rounded-xl px-3 py-2.5 w-72 bg-white focus:ring-2 focus:ring-green-500 focus:border-transprent shadow-sm" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2.5 bg-white shadow-sm">
            <option value="">Urutkan</option>
            <option value="id">ID</option>
            <option value="payment_method">Metode Pembayaran</option>
            <option value="total">Total</option>
            <option value="date">Tanggal</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)} className="border border-slate-200 rounded-xl px-4 py-2.5 bg-white shadow-sm">
            <option value="asc">A - Z</option>
            <option value="desc">Z - A</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-6 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">ID</th>
              <th className="px-6 py-6 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Cashier</th>
              <th className="px-6 py-6 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Payment Method</th>
              <th className="px-6 py-6 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Total</th>
              <th className="px-6 py-6 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Date</th>
              <th className="px-6 py-6 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Belum ada transaksi
                </td>
              </tr>
            ) : (
              transactions.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-slate-600">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.User?.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.payment_method}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">Rp {item.total.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(item.date).toLocaleDateString("id-ID")}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 flex justify-center gap-2">
                    <button onClick={() => navigate(`/history/${item.id}`)} className="bg-green-600 hover:bg-green-500 font-semibold text-white px-3 py-1 rounded-lg">
                      Detail
                    </button>
                    <button onClick={() => deleteTransaction(item.id)} className="bg-red-600 hover:bg-red-500 font-semibold text-white px-3 py-1 rounded-lg">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
        <div className="flex gap-3">
          <span className="text-gray-500">Items per page</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded-lg px-2 py-1"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={18}>18</option>
            <option value={25}>25</option>
          </select>
          <span className="text-gray-600">
            {rangeData} of {totalData} items
          </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-4">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="disabled:opacity-40">
                <IoPlaySkipBackSharp />
              </button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="disabled:opacity-40">
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPage}
              </span>
              <button disabled={currentPage === totalPage} onClick={() => setCurrentPage(currentPage + 1)} className="disabled:opacity-40">
                Next
              </button>
              <button disabled={currentPage === totalPage} onClick={() => setCurrentPage(totalPage)} className="disabled:opacity-40">
                <IoPlaySkipForwardSharp />
              </button>
            </span>
          </div>
        </div>
    </>
  );
}

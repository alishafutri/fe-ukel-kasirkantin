import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../services/api";

export default function HistoryDetail() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    getDetail();
  }, []);

  async function getDetail() {
    try {
      const response = await apiFetch(`/transaksi/${id}`);
      const result = await response.json();

      setTransaction(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (!transaction) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h1 className="text-center text-2xl font-bold">Kasir Kantin</h1>
        <p className="text-center text-gray-500 text-sm mb-4">Detail Transaksi</p>
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <div className="space-y-1 text-sm">
          <p>
            <strong>ID:</strong> {transaction.id}
          </p>
          <p>
            <strong>Kasir:</strong> {transaction.User?.name}
          </p>
          <p>
            <strong>Tanggal:</strong> {new Date(transaction.date).toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Pembayaran:</strong> {transaction.payment_method}
          </p>
        </div>
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <div className="space-y-3">
          {transaction.DetailTransaksis?.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between font-medium">
                <span>{item.Menu?.name}</span>
                <span>Rp {item.subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {item.quantity} x Rp {item.Menu.price.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total</span>
            <span>Rp {transaction.total.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span>Bayar</span>
            <span>Rp {transaction.amount_paid.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-bold text-green-600">
            <span>Kembalian</span>
            <span>Rp {transaction.change_amount.toLocaleString("id-ID")}</span>
          </div>
        </div>
        <div className="border-t border-dashed border-gray-400 my-4"></div>
        <p className="text-center text-gray-500 text-sm">Terima Kasih Sudah Berbelanja</p>
      </div>
    </div>
  );
}

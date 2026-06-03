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

            // console.log(result.data)
            setTransaction(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    if (!transaction) {
        return <p>Loading...</p>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <h1 className="text-3xl font-bold mb-6">
                Detail Transaksi
            </h1>
            <div className="mb-6 space-y-2">
                <p>
                    <strong>ID:</strong> {transaction.id}
                </p>
                <p>
                    <strong>Cashier:</strong> {transaction.User?.name}
                </p>
                <p>
                    <strong>Payment Method:</strong> {" "} {transaction.payment_method}
                </p>
                <p>
                    <strong>Total:</strong>Rp {" "} {transaction.total.toLocaleString("id-ID")}
                </p>
                <p>
                    <strong>Bayar:</strong> Rp {" "} {transaction.amount_paid.toLocaleString("id-ID")}
                </p>
                <p>
                    <strong>Kembalian:</strong> Rp {" "} {transaction.change_amount.toLocaleString("id-ID")}
                </p>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-3">Menu</th>
                        <th className="text-left p-3">Quantity</th>
                        <th className="text-left p-3">Harga</th>
                        <th className="text-left p-3">Subtotal</th>
                    </tr>
                </thead>

                <tbody>
                    {transaction.DetailTransaksis?.map((item) => (
                        <tr key={item.id} className="border-b">
                            <td className="p-3">{item.Menu?.name}</td>
                            <td className="p-3">{item.quantity}</td>
                            <td className="p-3">Rp {item.Menu?.price.toLocaleString("id-ID")}</td>
                            <td className="p-3">Rp {item.subtotal.toLocaleString("id-ID")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
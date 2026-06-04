import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForwardSharp } from "react-icons/io5";

export default function Transaksi() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [limit, setLimit] = useState(10);
  const [rangeData, setRangeData] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const filteredMenus = menus.filter((menu) => {
    const matchSearch = menu.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "all" || menu.category.toLowerCase() === selectedCategory;
    return matchSearch && matchCategory;
  });

  useEffect(() => {
    getMenus();
  }, [currentPage, limit]);

  async function getMenus() {
    try {
      const response = await apiFetch(`/menu?page=${currentPage}&limit=${limit}`);
      const result = await response.json();
      console.log(result);

      setMenus(result.data.data);
      setCurrentPage(result.data.currentPage);
      setTotalPage(result.data.totalPage);
      setTotalData(result.data.total);
      setRangeData(result.data.rangeData);
    } catch (error) {
      console.log(error);
    }
  }

  function addToCart(menu) {
    if (menu.stock <= 0) {
      alert("Stock habis");
      return;
    }
    const existing = cart.find((item) => item.id === menu.id);

    if (existing) {
      setCart(cart.map((item) => (item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
  }

  function increaseQty(id) {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          if (item.quantity >= item.stock) {
            alert("Stock tidak cukup");
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    );
  }

  function decreaseQty(id) {
    const existing = cart.find((item) => item.id === id);
    if (existing.quantity === 1) {
      setCart(cart.filter((item) => item.id !== id));
      return;
    }

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const change = Number(amountPaid || 0) - total;

  async function createTransaction() {
    if (cart.length === 0) {
      alert("Cart masih kosong");
      return;
    }

    if (!paymentMethod) {
      alert("Pilih metode pembayaran terlebih dahulu!");
      return;
    }
    try {
      const payload = {
        payment_method: paymentMethod,
        amount_paid: paymentMethod === "qris" ? total : Number(amountPaid),
        items: cart.map((item) => ({
          menu_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await apiFetch("/transaksi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert("Transaksi berhasil");

      setTransactionData(result.data);
      setShowReceipt(true);
      setCart([]);
      setAmountPaid("");
      setPaymentMethod("");
      getMenus();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Transaksi</h1>
          <div className="flex gap-2 mb-6">
            <input type="text" value={search} placeholder="Cari menu..." onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 px-4 py-2 rounded-xl w-72 bg-white" />
            <button onClick={() => setSelectedCategory("all")} className={`px-4 py-2 rounded-full ${selectedCategory == "all" ? "bg-green-600 text-white" : "bg-white border"}`}>
              All
            </button>
            <button onClick={() => setSelectedCategory("food")} className={`px-4 py-2 rounded-full ${selectedCategory == "food" ? "bg-green-600 text-white" : "bg-white border"}`}>
              Food
            </button>
            <button onClick={() => setSelectedCategory("drink")} className={`px-4 py-2 rounded-full ${selectedCategory == "drink" ? "bg-green-600 text-white" : "bg-white border"}`}>
              Drink
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 grid grid-cols-3 gap-4">
            {filteredMenus.map((menu) => (
              <div key={menu.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
                <img src={menu.image} alt={menu.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{menu.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{menu.category}</p>
                  <p className="font-bold text-green-600">Rp {menu.price.toLocaleString("id-ID")}</p>
                  <p className="text-xs text-gray-500 mt-2">Stock : {menu.stock}</p>
                  <button onClick={() => addToCart(menu)} className="mt-3 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-500">
                    Tambah
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-4">
            <div className="bg-white rounded-2xl shadow-sm p-5 h-full top-5">
              <h2 className="text-xl font-bold mb-4">Cart</h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.length === 0 && <p className="text-center text-gray-500">Cart Masih kosong</p>}
                {cart.map((item) => (
                  <div key={item.id} className="border rounded-xl p-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">Rp {item.price.toLocaleString("id-ID")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => decreaseQty(item.id)} className="w-7 h-7 bg-red-500 text-white rounded">
                          {" "}
                          -{" "}
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id)} className="w-7 h-7 bg-green-500 text-white rounded">
                          {" "}
                          +{" "}
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-right font-semibold">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>

              <div className="mt-4">
                <label htmlFor className="text-sm font-medium">
                  Metode Pembayaran
                </label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border rounded-xl p-2 mt-1">
                  <option value="">Pilih Metode</option>
                  <option value="cash">Cash</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>

              {paymentMethod === "cash" && (
                <>
                  <input type="number" placeholder="Jumlah Bayar" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="w-full border rounded-xl p-2 mt-4" />
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Kembalian</p>
                    <p className="font-bold text-green-600">Rp {change > 0 ? change.toLocaleString("id-ID") : 0}</p>
                  </div>
                </>
              )}

              {paymentMethod == "qris" && (
                <div className="mt-4 text-center">
                  <img src="/barcode.png" alt="QRIS" className="mx-auto rounded-xl" />
                  <p className="text-sm text-gray-500 mt-2">Scan QR untuk pembayaran</p>
                </div>
              )}
              <button onClick={createTransaction} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl mt-5 font-semibold">
                Bayar Sekarang
              </button>
            </div>
            {showReceipt && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-xl w-96">
                  <h2 className="font-bold text-xl mb-4">Struk Transaksi</h2>
                  <div className="border-t border-dashed border-gray-400 my-4"></div>
                  <p>ID: {transactionData.id}</p>
                  <p>Metode: {transactionData.payment_method}</p>
                  <p>Total: Rp {transactionData.total.toLocaleString("id-ID")}</p>
                  <p>Bayar: Rp {transactionData.amount_paid.toLocaleString("id-ID")}</p>
                  <p>Kembalian: Rp {transactionData.change_amount.toLocaleString("id-ID")}</p>
                  <div className="border-t border-dashed border-gray-400 my-4"></div>
                  <p className="text-center text-gray-500 text-sm">Terima Kasih Sudah Berbelanja</p>
                  <button onClick={() => setShowReceipt(false)} className="mt-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg">
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xm text-gray-500">Items per page</span>
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
          <span className="text-sm text-gray-500">
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

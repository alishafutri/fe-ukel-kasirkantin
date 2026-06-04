import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForwardSharp } from "react-icons/io5";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [oldStock, setOldStock] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [limit, setLimit] = useState(10);
  const[rangeData, setRangeData] = useState("");

  const [form, setForm] = useState({
      name: "",
      category: "",
      price: "",
      stock: "",
    });
    const [image, setImage] = useState(null);
      
    async function getMenus() {
        try {
            const response = await apiFetch(`/menu?page=${currentPage}&limit=${limit}&name=${search}&sortBy=${sortBy}&order=${order}`);
            const result = await response.json();
            //   console.log(result);
            setMenus(result.data.data);
            setCurrentPage(result.data.currentPage);
            setTotalPage(result.data.totalPage);
            setTotalData(result.data.total);

            setRangeData(result.data.rangeData);
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
      getMenus();
    }, [currentPage, limit, search, sortBy, order]);
    
  async function createMenu(e) {
    e.preventDefault();
    try {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("category", form.category);
        formData.append("price", form.price);
        formData.append("stock", form.stock);

        if (image) {
            formData.append("image", image);
        }

        const response = await apiFetch('/menu', {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if(!response.ok) {
            alert(result.message);
            return;
        }
        setOpenModal(false);

        setForm({
            name: "",
            category: "",
            price: "",
            stock: "",
        });

        setImage(null);

        getMenus();
    } catch (error) {
        console.log(error)
    }
  }

  function handleEdit(menu) {
    setOldStock(menu.stock);

    setIsEdit(true);
    setSelectedId(menu.id);

    setForm({
        name: menu.name,
        category: menu.category,
        price: menu.price,
        stock: menu.stock,
    });

    setOpenModal(true);
  }

  async function updateMenu(e) {
    e.preventDefault();

    try{
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("category", form.category);
        formData.append("price", form.price);
        formData.append("stock", form.stock);
        if (image) {
            formData.append("image", image);
        }

        if (Number(form.stock) < Number(oldStock)) {
            alert(`Stock tidak boleh kurang data ${oldStock}`);
            return;
        }

        const response = await apiFetch(`/menu/${selectedId}`, {
            method: "PUT",
            body: formData,
        });

        const result = await response.json();

        if(!response.ok) {
            console.log(result.message);
            return;
        }

        setOpenModal(false);
        setIsEdit(false);
        setSelectedId(null);

        setForm({
            name: "",
            category: "",
            price: "",
            stock: "",
        });

        setImage(null);

        getMenus();
    } catch (error) {
        console.log(error)
    }
  }

  function closeModal() {
    setOpenModal(false);

    setForm({
        name: "",
        category: "",
        price: "",
        stock: "",
    });
    setImage(null);
  }

  async function deleteMenu(id) {
    const confirmDelete = window.confirm("Yakin ingin menghapus menu ini?");
    if (!confirmDelete) return;
    try {
        const response = await apiFetch(`/menu/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();
        console.log(result);
        if(!response.ok) {
            alert(result.message);
            return;
        }
        getMenus();
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Menu</h2>
        <div className=" flex gap-3">
            <input type="text" placeholder="Cari Menu ..." value={search} onChange={(e) => setSearch(e.target.value)} className="border px-3 py-2 w-72 rounded"/>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-3 py-2 rounded">
                <option value="">Urutkan</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
            </select>
            <select value={order} onChange={(e) => setOrder(e.target.value)} className="border px-3 py-2 rounded">
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
            </select>
            <button onClick={() => setOpenModal(true)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded">+ Tambah Menu</button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="border-r border-gray-200  px-4 py-3 bg-gray-100">Image</th>
              <th className="border-r border-gray-200 px-4 py-3 bg-gray-100">Menu Names</th>
              <th className="border-r border-gray-200 px-4 py-3 bg-gray-100">Categori</th>
              <th className="border-r border-gray-200 px-4 py-3 bg-gray-100">Price</th>
              <th className="border-r border-gray-200 px-4 py-3 bg-gray-100">Stock</th>
              <th className="border-r border-gray-200 px-4 py-3 bg-gray-100">Actions</th>
            </tr>
          </thead>

          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id} className="border-b border-gray-200 text-center">
                <td className="border-r border-gray-200 px-6 py-4 text-sm text-gray-600">
                  <img src={menu.image} alt={menu.name} className="w-14 h-14 object-cover mx-auto" />
                </td>
                <td className="border border-gray-200 px-6 py-4 text-sm text-gray-600">{menu.name}</td>
                <td className="border-r border-gray-200 px-6 py-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${menu.category === "food" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}> {menu.category}</span>
                </td>
                <td className="border-r border-gray-200 px-6 py-4 text-sm text-gray-600">Rp {menu.price.toLocaleString("id-ID")}</td>
                <td className="border-r border-gray-200 px-6 py-4 text-sm text-gray-600">{menu.stock}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(menu)} className="bg-yellow-400 hover:bg-yellow-300 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => deleteMenu(menu.id)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-3 border-t">
            <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm">
                    Items per page
                </span>
                <select value={limit} onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                }} className="border rounded px-2 py-1">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
                <span className="text-gray-600 text-sm">
                    {rangeData} of {totalData} items
                </span>
            </div>
            <div className="flex items-center gap-4">
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
            </div>
        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white w-120 p-5 rounded border border-gray-200">
                <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Menu" : "Tambah Menu"}</h2>
                <form onSubmit={isEdit ? updateMenu : createMenu} className="space-y-4">
                    <input type="text" placeholder="Nama" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" required />
                    <select value={form.category} onChange={(e) => setForm({...form, category:e.target.value})} className="w-full border rounded-lg p-2">
                        <option value="">Pilih Kategori</option>
                        <option value="food">Food</option>
                        <option value="drink">Drink</option>
                    </select>
                    <input type="text" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full border rounded-lg p-2" required />
                    <input type="text" placeholder="Stock" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="w-full border rounded-lg p-2" required />
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg">Batal</button>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">{isEdit ? "Update" : "Simpan"}</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { Table, TableRow, Button } from "flowbite-react";

export default function User() {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [image, setImage] = useState(null);

  
  async function getUsers() {
      try {
          const response = await apiFetch(`/user?name=${search}&sortBy=${sortBy}&order=${order}`);
          const result = await response.json();
          //   console.log(result)
          setUsers(result.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
      getUsers();
    }, [search, sortBy, order]);
    
  async function createUser(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("password", form.password);

      if (image) {
        formData.append("profile_image", image);
      }

      const response = await apiFetch("/user", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setOpenModal(false);

      setForm({
        name: "",
        username: "",
        password: "",
      });

      setImage(null);

      getUsers();
    } catch (error) {
      console.log(error);
    }
  }

  function handleEdit(user) {
    setIsEdit(true);
    setSelectedId(user.id);

    setForm({
        name: user.name,
        username: user.username,
        password: "",
    });

    setOpenModal(true);
  }

  async function updateUser(e) {
    e.preventDefault();

    try {
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("username", form.username);
        if(form.password) {
            formData.append("password", form.password);
        }

        if (image) {
            formData.append("profile_image", image);
        }

        const response = await apiFetch(`/user/${selectedId}`, {
            method: "PUT",
            body: formData,
        });

        const result = await response.json();

        if(!response.ok) {
            alert(result.message);
            return
        }

        setOpenModal(false);
        setIsEdit(false);
        setSelectedId(null);

        setForm({
            name: "",
            username: "",
            password: "",
        });

        setImage(null);

        getUsers();
    } catch (error) {
        console.log(error)
    }
  }

  function closeModal() {
    setOpenModal(false);
    setIsEdit(false);
    setSelectedId(null);

    setForm({
        name: "",
        username: "",
        password: "",
    });

    setImage(null);
  }

  async function deleteUser(id) {
    const confirmDelete = window.confirm("Yakin ingin menghapus user ini?");

    if (!confirmDelete) return;
    try {
      const response = await apiFetch(`/user/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        alert(result.message);
        return;
      }

      getUsers();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Kelola User</h1>
        <div className="flex gap-3">
        <input type="text" placeholder="Cari user..." value={search} onChange={(e) => setSearch(e.target.value)} className="border px-3 py-2 w-72 rounded" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-3 py-2 rounded">
            <option value="">Urutkan</option>
            <option value="name">Nama</option>
            <option value="username">Username</option>
            <option value="role">Role</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)} className="border px-3 py-2 rounded">
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
        </select>
        <button onClick={() => setOpenModal(true)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded" >
          + Tambah User
        </button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="border-r border-gray-200 px-4 py-3 bg-gray-100">Nama</th>
              <th className="border-r border-gray-200 px-4 py-3 bg-gray-100">Username</th>
              <th className="border-r border-gray-200 px-4 py-3 bg-gray-100">Role</th>
              <th className="border-r border-gray-200 px-4 py-3 bg-gray-100">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3 font-medium border-r border-gray-100 text-center">{user.name}</td>
                <td className="px-4 py-3 text-gray-600 border-r border-gray-100 text-center">{user.username}</td>
                <td className="px-4 py-3 border-r border-gray-100 text-center">
                  <span className={`px-2 py-1 text-xs rounded-md font-medium ${user.role === "admin" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>{user?.role}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(user)} className="bg-yellow-400 hover:bg-yellow-300 text-white px-3 py-1 rounded">Edit</button>
                    {user.role === "admin" ? (
                      <button />
                    ) : (
                      <button onClick={() => deleteUser(user.id)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded">
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white w-120 p-5 rounded border border-gray-200">
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit User" : "Tambah User"}</h2>

            <form onSubmit={isEdit ? updateUser : createUser} className="space-y-4">
              <input type="text" placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg p-2" required/>
              <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full border rounded-lg p-2"  required/>
              <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border rounded-lg p-2"  required/>
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

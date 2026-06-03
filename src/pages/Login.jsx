import { Button, Card, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ToastFailed from "../components/ToastFailed";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: " ",
    password: "",
  });
  const [error, setError] = useState("");

  async function sendLoginData() {
    try {
      const response = await apiFetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();
        if (!response.ok) {
          setError(result.message || "Login gagal");
          return;
        }
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      setError("");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan pada server");
    }
  }
  async function submitForm(e) {
    e.preventDefault();
    if (form.username === "" || form.password === "") {
      setError("Gagal! pastikan username dan password terisi.");
      return;
    }

    await sendLoginData();
  }
  return (
    <>
      {error !== "" && <ToastFailed error={error} />}
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: "radial-gradient(#81c784 1px, transparent 1px)", backgroundSize: "35px 35px" }}>
        <Card className="w-full max-w-sm h-100 shadow-lg bg-white">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-gray-500">Enter your username and password</p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={submitForm}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username">Username</Label>
              </div>
              <TextInput color="" id="username" type="text" placeholder="Masukan Username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Password</Label>
              </div>
              <TextInput color="" id="password" type="password" placeholder="Masukan Password" className="border-amber-50" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <Button type="submit" className="bg-green-700 hover:bg-green-500 w-full">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

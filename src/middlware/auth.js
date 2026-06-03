import { redirect } from "react-router-dom";

export function auth() {
    const token = localStorage.getItem("token");

    // jika belum ada token, arahkan ke login
    if(!token) {
        return redirect("/login");
    }

    return null;
}
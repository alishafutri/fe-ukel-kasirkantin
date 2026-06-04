import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiChartPie,
  HiShoppingBag,
  HiUser,
  HiInbox,
  HiArrowSmRight,
} from "react-icons/hi";

export default function SidebarComp() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  }

  function isActive(path) {
    return location.pathname.startsWith(path);
  }

  return (
    <div className="min-h-screen w-64 bg-green-600 text-white flex flex-col">
      <div className="p-6 border-b border-green-500">
        <h1 className="text-2xl font-bold">
          Kasir Kantin
        </h1>
      </div>

      <div className="flex-1 p-4">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
            isActive("/dashboard")
              ? "bg-white text-green-600"
              : "hover:bg-green-500"
          }`}
        >
          <HiChartPie
            className={
              isActive("/dashboard")
                ? "text-green-600"
                : "text-white"
            }
          />
          Dashboard
        </Link>

        {user?.role === "admin" && (
          <>
            <Link
              to="/menu"
              className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
                isActive("/menu")
                  ? "bg-white text-green-600"
                  : "hover:bg-green-500"
              }`}
            >
              <HiShoppingBag
                className={
                  isActive("/menu")
                    ? "text-green-600"
                    : "text-white"
                }
              />
              Menu
            </Link>

            <Link
              to="/user"
              className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
                isActive("/user")
                  ? "bg-white text-green-600"
                  : "hover:bg-green-500"
              }`}
            >
              <HiUser
                className={
                  isActive("/user")
                    ? "text-green-600"
                    : "text-white"
                }
              />
              User
            </Link>
          </>
        )}

        {user?.role === "kasir" && (
          <Link
            to="/transaksi"
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
              isActive("/transaksi")
                ? "bg-white text-green-600"
                : "hover:bg-green-500"
            }`}
          >
            <HiShoppingBag
              className={
                isActive("/transaksi")
                  ? "text-green-600"
                  : "text-white"
              }
            />
            Transaction
          </Link>
        )}

        <Link
          to="/history"
          className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
            isActive("/history")
              ? "bg-white text-green-600"
              : "hover:bg-green-500"
          }`}
        >
          <HiInbox
            className={
              isActive("/history")
                ? "text-green-600"
                : "text-white"
            }
          />
          History
        </Link>
      </div>

      <div className="p-4 border-t border-green-500">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-500"
        >
          <HiArrowSmRight />
          Logout
        </button>
      </div>
    </div>
  );
}
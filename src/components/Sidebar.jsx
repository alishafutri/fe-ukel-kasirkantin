"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiChartPie, HiShoppingBag, HiUser, HiInbox, HiArrowSmRight, HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";

export default function SidebarComp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: HiChartPie,
      roles: ["admin", "kasir"],
    },
    {
      label: "Menu",
      path: "/menu",
      icon: HiShoppingBag,
      roles: ["admin"],
    },
    {
      label: "User",
      path: "/user",
      icon: HiUser,
      roles: ["admin"],
    },
    {
      label: "Transaction",
      path: "/transaksi",
      icon: HiShoppingBag,
      roles: ["kasir"],
    },
    {
      label: "History",
      path: "/history",
      icon: HiInbox,
      roles: ["admin", "kasir"],
    },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 z-50 lg:hidden bg-green-600 text-white p-2 rounded-lg shadow-lg">
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-green-600 text-white flex flex-col shadow-xl z-40 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 pb-8">
          <div className="flex items-center gap-3 mb-5 p-4 border-b border-green-500/30">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Kasir Kantin</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-green-300 uppercase tracking-wider mb-3">Main Menu</p>
            {filteredMenu.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    active ? "bg-white text-green-700 shadow-lg shadow-green-900/20 font-semibold" : "text-green-50 hover:bg-green-500/40 hover:text-white"
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${active ? "bg-green-100" : "bg-green-500/30 group-hover:bg-green-500/50"}`}>
                    <Icon className={`w-5 h-5 ${active ? "text-green-600" : "text-green-200"}`} />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-green-500/30">
          <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-green-100 hover:bg-red-500/20 hover:text-red-100 transition-all duration-200 group">
            <div className="p-2 rounded-lg bg-green-500/30 group-hover:bg-red-500/30 transition-colors">
              <HiArrowSmRight className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

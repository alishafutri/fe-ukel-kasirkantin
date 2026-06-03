import { useState } from "react";
import { HiBell, HiChevronDown, HiMenu } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function NavbarComp() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-800 hidden sm:block">
                Kasir Kantin
              </span>
            </Link>
          </div>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
              >
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-emerald-200 transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm ring-2 ring-slate-100 group-hover:ring-emerald-200 transition-all">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-700 leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-400 capitalize leading-tight">
                    {user?.role}
                  </p>
                </div>

                <HiChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 sm:hidden">
                      <p className="text-sm font-semibold text-slate-800">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <div className=" border-slate-100 px-2">
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          window.location.href = "/";
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
    </nav>
  );
}
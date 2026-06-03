import { Outlet } from "react-router-dom";
import NavbarComp from "./components/Navbar";
import SidebarComp from "./components/Sidebar";

export default function Template() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarComp />

      <div className="flex-1">
        <NavbarComp />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

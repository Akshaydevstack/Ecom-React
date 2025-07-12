import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminNavbar from "../AdminSection/Components/AdminNavBar";

export default function AdminLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-900
          ${isSidebarExpanded ? "w-56" : "w-16"}
          transition-all duration-300 ease-in-out z-50`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <AdminNavbar isExpanded={isSidebarExpanded} />
      </div>

      {/* Main content */}
      <div
        className={`flex-1 ${isSidebarExpanded ? "ml-56" : "ml-16"}
          transition-all duration-300 ease-in-out`}
      >
        <Outlet />
      </div>
    </div>
  );
}
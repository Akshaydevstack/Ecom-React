import { Outlet } from "react-router-dom";
import AdminNavbar from "../AdminSection/Components/AdminNavBar";

export default function AdminLayout() {
  return (
    <div className="group flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-300">
      <AdminNavbar />
      <div className="
        flex-1 
        ml-16 
       group-hover:ml-52 
        transition-all 
        duration-300 
        ease-[cubic-bezier(0.4,0,0.2,1)] 
      ">
        <Outlet />
      </div>
    </div>
  );
}
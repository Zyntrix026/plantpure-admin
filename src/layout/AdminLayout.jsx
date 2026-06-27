import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // Yeh sabse zaruri hai
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved === "true"; 
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar fixed rahega */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        collapsed ? "ml-20" : "ml-72"
      }`}>
        <AdminNavbar collapsed={collapsed} />

        <main className="flex-1 pt-[70px]">
          <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
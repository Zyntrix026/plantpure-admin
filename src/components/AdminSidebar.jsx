import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Cpu,
  MessageSquare,
  Mail,
  FileText,
  Image,
  Tag,
  Star,
  Ticket,
} from "lucide-react";

const menuGroups = [
  {
    title: "",
    items: [
      { name: "Dashboard", path: "/admin/overview", icon: <LayoutDashboard size={20} /> },
    ],
  },
  {
    title: "Inventory",
    items: [
      { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
      { name: "Add Products", path: "/admin/addproducts", icon: <Plus size={20} /> },
      { name: "Categories", path: "/admin/categories", icon: <Cpu size={20} /> },
      // { name: "Hero Banner", path: "/admin/hero-banner", icon: <Image size={20} /> },
      // { name: "Deals Of Day", path: "/admin/deals-of-day", icon: <Tag size={20} /> },
      // { name: "Popular Products", path: "/admin/popular-products", icon: <Star size={20} /> },
      { name: "Coupons", path: "/admin/coupons", icon: <Ticket size={20} /> },
    ],
  },
  {
    title: "Customers & Social",
    items: [
      { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
      { name: "Customers", path: "/admin/customer", icon: <Users size={20} /> },
      { name: "Reviews", path: "/admin/review", icon: <MessageSquare size={20} /> },
    ],
  },
  // {
  //   title: "Management",
  //   items: [
  //     { name: "Admin Management", path: "/admin/admin-managemenet", icon: <Mail size={20} /> },
  //     { name: "Static Pages", path: "/admin/staticpage", icon: <FileText size={20} /> },
  //     { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  //     { name: "Email Campaign", path: "/admin/email-campaign", icon: <Mail size={20} /> },
  //   ],
  // },
];

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-100 shadow-xl transition-all duration-300 z-[60] flex flex-col ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* CSS for hiding scrollbar directly in the component */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 h-20 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <img src="/logo.png" alt="logo" className="w-[70px]" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-xl bg-primary text-white hover:opacity-90 transition-all ${
            collapsed ? "mx-auto" : ""
          }`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Sidebar Navigation - With Scroll & Hidden Scrollbar */}
      <nav className="flex-1 px-4 pb-6 overflow-y-auto no-scrollbar">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-6">
            {!collapsed && (
              <h2 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 whitespace-nowrap">
                {group.title}
              </h2>
            )}

            <div className="space-y-1">
              {group.items.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 group ${
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-slate-500 hover:bg-slate-50"
                    }`
                  }
                >
                  <span className="shrink-0">{item.icon}</span>

                  {!collapsed && (
                    <span className="text-sm font-bold whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
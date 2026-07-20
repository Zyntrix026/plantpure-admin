import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Cpu,
  MessageSquare,
  FileText,
  Ticket,
  Facebook,
  Instagram,
  ChevronDown,
  Inbox,
  Sparkles
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
      { name: "Coupons", path: "/admin/coupons", icon: <Ticket size={20} /> },
      { name: "Blogs", path: "/admin/blogs", icon: <FileText size={20} /> },
    ],
  },
  {
    title: "Customers & Social",
    items: [
      {
        id: "lead-inbox",
        name: "Lead Inbox",
        icon: <Inbox size={20} />, // Changed to Inbox icon for better contextual design
        isDropdown: true,
        subItems: [
          { name: "Facebook", path: "/admin/leads/facebook", icon: <Facebook size={18} /> },
          { name: "Instagram", path: "/admin/leads/instagram", icon: <Instagram size={18} /> },
        ],
      },
        {
        id: "leads",
        name: "Campaign Leads", // Changed to a more distinctive name
        icon: <Sparkles size={20} />, // Unique icon to distinguish from standard Inbox
        isDropdown: true,
        subItems: [
          { name: "Facebook Leads", path: "/admin/facebook/leads", icon: <Facebook size={18} /> },
          { name: "Website Leads", path: "/admin/website/leads", icon: <MessageSquare size={18} /> },
        ],
      },
      { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
      { name: "Customers", path: "/admin/customer", icon: <Users size={20} /> },
      { name: "Reviews", path: "/admin/review", icon: <MessageSquare size={20} /> },
    
    ],
  },
];

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  
  // Track open states of each dropdown independently using keys/IDs
  const [openDropdowns, setOpenDropdowns] = useState({
    "lead-inbox": false,
    "leads": false,
  });

  // Automatically open the dropdown if a sub-item is active on page load/route change
  useEffect(() => {
    menuGroups.forEach(group => {
      group.items.forEach(item => {
        if (item.isDropdown && item.subItems) {
          const hasActiveChild = item.subItems.some(sub => location.pathname === sub.path);
          if (hasActiveChild) {
            setOpenDropdowns(prev => ({ ...prev, [item.id]: true }));
          }
        }
      });
    });
  }, [location.pathname]);

  const toggleDropdown = (id) => {
    if (collapsed) {
      setCollapsed(false); // If collapsed, open the sidebar first
    }
    setOpenDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-100 shadow-xl transition-all duration-300 z-[60] flex flex-col ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      {/* Scrollbar reset utility */}
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
        {!collapsed ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <img src="/logo.png" alt="logo" className="w-[70px] object-contain transition-all" />
          </div>
        ) : (
          <div className="mx-auto w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
            <img src="/logo.png" alt="logo" className="w-[28px] object-contain" />
          </div>
        )}

        {!collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Collapsed Toggle Trigger when Sidebar is minimized */}
      {collapsed && (
        <div className="px-4 mb-4 shrink-0 flex justify-center">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2.5 rounded-xl bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 pb-6 overflow-y-auto no-scrollbar">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-6">
            {!collapsed && group.title && (
              <h2 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 whitespace-nowrap">
                {group.title}
              </h2>
            )}

            <div className="space-y-1">
              {group.items.map((item, index) => {
                
                // --- DROPDOWN ITEMS HANDLER ---
                if (item.isDropdown) {
                  const isSubItemActive = item.subItems.some(sub => location.pathname === sub.path);
                  const isDropdownOpen = openDropdowns[item.id];

                  return (
                    <div key={index} className="w-full">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.id)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 group relative ${
                          isSubItemActive || isDropdownOpen
                            ? "bg-slate-50 text-slate-900 font-bold"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        } ${collapsed ? "justify-center" : ""}`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className={`shrink-0 transition-transform group-hover:scale-105 ${
                            isSubItemActive ? "text-primary" : ""
                          }`}>
                            {item.icon}
                          </span>
                          {!collapsed && (
                            <span className="text-sm font-bold whitespace-nowrap">
                              {item.name}
                            </span>
                          )}
                        </div>

                        {!collapsed && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 text-slate-400 group-hover:text-slate-600 ${
                              isDropdownOpen ? "rotate-180 text-primary" : ""
                            }`}
                          />
                        )}

                        {/* Premium Tooltip for Collapsed view */}
                        {collapsed && (
                          <div className="absolute left-full ml-4 px-3 py-2 bg-slate-950 text-slate-200 text-xs font-semibold rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all shadow-xl z-50 border border-slate-800">
                            {item.name}
                          </div>
                        )}
                      </button>

                      {/* Dropdown Options render only if expanded & not collapsed */}
                      {!collapsed && isDropdownOpen && (
                        <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-100 space-y-1.5 transition-all">
                          {item.subItems.map((subItem, sIdx) => (
                            <NavLink
                              key={sIdx}
                              to={subItem.path}
                              className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                  isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/25 font-semibold"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }`
                              }
                            >
                              <span className="shrink-0">{subItem.icon}</span>
                              <span className="text-sm font-semibold whitespace-nowrap">
                                {subItem.name}
                              </span>
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // --- STANDARD NAVLINKS HANDLER ---
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-200 group relative ${
                        collapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/25 font-semibold"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`
                    }
                  >
                    <span className="shrink-0 transition-transform group-hover:scale-105">
                      {item.icon}
                    </span>

                    {!collapsed && (
                      <span className="text-sm font-bold whitespace-nowrap">
                        {item.name}
                      </span>
                    )}

                    {/* Premium Tooltip for Collapsed view */}
                    {collapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-slate-950 text-slate-200 text-xs font-semibold rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all shadow-xl z-50 border border-slate-800">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
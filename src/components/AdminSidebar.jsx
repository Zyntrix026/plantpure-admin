import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  Facebook,
  Instagram,
  MessageCircle,
  ChevronDown,
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
      { name: "Blogs", path: "/admin/blogs", icon: <FileText size={20} /> },
    ],
  },
  {
    title: "Customers & Social",
    items: [
            {
        name: "Lead Inbox",
        icon: <MessageSquare size={20} />,
        isDropdown: true,
        subItems: [
          { name: "Facebook", path: "/admin/leads/facebook", icon: <Facebook size={18} /> },
          { name: "Instagram", path: "/admin/leads/instagram", icon: <Instagram size={18} /> },
          { name: "WhatsApp", path: "/admin/leads/whatsapp", icon: <MessageCircle size={18} /> },
        ],
      },
      { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },

      { name: "Customers", path: "/admin/customer", icon: <Users size={20} /> },
      { name: "Reviews", path: "/admin/review", icon: <MessageSquare size={20} /> },
  
    ],
  },
];

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const [leadInboxOpen, setLeadInboxOpen] = useState(false);
  const location = useLocation();

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
              {group.items.map((item, index) => {
                // Check if this item is the Dropdown (Lead Inbox)
                if (item.isDropdown) {
                  const isSubItemActive = item.subItems.some(sub => location.pathname === sub.path);
                  
                  return (
                    <div key={index} className="w-full">
                      {/* Lead Inbox Main Button */}
                      <button
                        onClick={() => {
                          if (collapsed) setCollapsed(false);
                          setLeadInboxOpen(!leadInboxOpen);
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 group ${
                          isSubItemActive || leadInboxOpen
                            ? "bg-slate-50 text-slate-800"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="shrink-0">{item.icon}</span>
                          {!collapsed && (
                            <span className="text-sm font-bold whitespace-nowrap">
                              {item.name}
                            </span>
                          )}
                        </div>
                        {!collapsed && (
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              leadInboxOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Dropdown Items (Facebook, Instagram, Whatsapp) */}
                      {!collapsed && leadInboxOpen && (
                        <div className="mt-1 ml-4 pl-2 border-l border-slate-100 space-y-1 transition-all">
                          {item.subItems.map((subItem, sIdx) => (
                            <NavLink
                              key={sIdx}
                              to={subItem.path}
                              className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                  isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-slate-500 hover:bg-slate-50"
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

                // Regular NavLinks (Dashboard, Products, etc.)
                return (
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
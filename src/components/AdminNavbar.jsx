import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from "lucide-react"; // Ya lucide-react
import { clearAuth, getAdminProfileData } from "../lib/auth"; // Aapka fetch function
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ collapsed }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [admin, setAdmin] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Fetch Admin Data
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await getAdminProfileData();
        console.log("Admin Profile Data:", data); // Debugging ke liye
        setAdmin(data);
      } catch (error) {
        console.error("Failed to load admin profile:", error);
      }
    };
    fetchAdmin();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  // Name ka first letter nikalne ke liye logic
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "A";
  };

  return (
    <header
      className={`fixed top-0 right-0 z-[40] transition-all duration-300 bg-primary backdrop-blur-md border-b border-white/10 shadow-lg`}
      style={{
        width: `calc(100% - ${collapsed ? "80px" : "288px"})`,
      }}
    >
      <div className="w-full px-4 md:px-8 h-[70px] flex items-center justify-end">
        {/* Search Bar */}
        {/* <div className="flex items-center gap-12">
          <div className="hidden lg:flex items-center bg-white/10 focus-within:bg-white/20 rounded-xl px-4 py-2 w-[350px] border border-white/5 transition-all">
            <Search size={18} className="text-white" />
            <input
              type="text"
              placeholder="Quick search..."
              className="bg-transparent outline-none px-3 w-full text-sm text-white placeholder-white"
            />
          </div>
        </div> */}

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Profile Dropdown */}
          <div className="relative " ref={profileRef}>
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3 p-1.5 pl-3 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-300 transition-all"
            >
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-sm font-bold text-white">
                  {admin ? admin.name : "Loading..."}
                </p>
                <p className="text-xs text-blue-200/60 font-medium capitalize">
                  {admin ? admin.role : "Administrator"}
                </p>
              </div>

              {/* Avatar Placeholder using First Letter */}
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 text-white font-bold text-sm shadow-inner">
                {getInitial(admin?.name)}
              </div>

              <ChevronDown
                size={14}
                className={`text-blue-200 transition-transform ${
                  openProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200">
                {/* Profile Header Info */}
                <div className="px-4 pt-1 border-b border-gray-50 mb-1">
                    <p className="text-base font-bold text-gray-800">{admin?.name}</p>
                    <p className="text-sm text-primary truncate">{admin?.email}</p>
                </div>

                {/* <div className="p-1">
                  <DropdownLink icon={<User size={16} />} label="My Profile" />
                  <DropdownLink icon={<Settings size={16} />} label="Settings" />
                </div> */}
                
                <div className=" pt-1 border-t border-gray-50 p-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-50 rounded-xl transition-all uppercase tracking-widest"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const DropdownLink = ({ icon, label }) => (
  <button className="flex items-center gap-3 w-full px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
    <span className="text-gray-400">{icon}</span>
    {label}
  </button>
);

export default AdminNavbar;
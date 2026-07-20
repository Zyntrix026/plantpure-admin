import React from "react";
import { FiPlus, FiLayers, FiCheckCircle, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";

const BlogHeroSection = ({ total, published, drafts }) => {
  const stats = [
    { label: "Total Posts", val: total, icon: <FiLayers />, color: "text-slate-600 bg-slate-50" },
    { label: "Published", val: published, icon: <FiCheckCircle />, color: "text-emerald-600 bg-emerald-50/50" },
    { label: "Drafts", val: drafts, icon: <FiFileText />, color: "text-amber-600 bg-amber-50/50" },
  ];

  return (
    <div className=" pb-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
            Articles
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage your content and view engagement metrics.
          </p>
        </div>
        
        <Link 
          to="/admin/blogs/create" 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm"
        >
          <FiPlus className="size-4" /> 
          New Article
        </Link>
      </div>
      
      {/* Stats Grid - Cleaner & Flatter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl transition-colors ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-slate-800">
                  {stat.val}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogHeroSection;
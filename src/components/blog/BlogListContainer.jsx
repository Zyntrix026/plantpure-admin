import React from "react";
import {
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiEye,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const BlogListContainer = ({
  blogs,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
  onRefresh,
  loading,
}) => {
  return (
    <div className="space-y-4">
      {/* Search & Filter Bar - More Refined */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 outline-none focus:border-slate-300"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <button
            onClick={onRefresh}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          >
            <FiRefreshCw className="size-4" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div
        className={`bg-white border border-slate-200 rounded-2xl overflow-hidden transition-opacity ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-[12px] font-medium text-slate-500 border-b border-slate-100">
                  ARTICLE
                </th>
                <th className="py-4 px-6 text-[12px] font-medium text-slate-500 border-b border-slate-100 text-center">
                  STATUS
                </th>
                <th className="py-4 px-6 text-[12px] font-medium text-slate-500 border-b border-slate-100 text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 leading-tight group-hover:text-slate-900">
                        {blog.title}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        blog.status === "published"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end items-center gap-1">
                      <Link
                        to={`/admin/blogs/view/${blog._id}`}
                        className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Blog"
                      >
                        <FiEye size={16} />
                      </Link>
                      <Link
                        to={`/admin/blogs/edit/${blog._id}`}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <FiEdit3 size={16} />
                      </Link>
                      <button
                        onClick={() => onDelete(blog._id, blog.title)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Minimalist Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-white">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
          >
            <FiChevronLeft /> Previous
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => onPageChange(n)}
                className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-all ${
                  currentPage === n
                    ? "bg-slate-100 text-slate-900 border border-slate-200 shadow-sm"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogListContainer;

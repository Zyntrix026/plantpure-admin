import React from "react";
import { Edit2, Trash2, ShieldCheck } from "lucide-react";

const AdminTable = ({ admins, filters, setFilters, totalPages, onEdit, onDelete, onToggleSuspend }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm font-semibold">
            <th className="p-4">Admin</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Created</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
          {admins.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-8 text-center text-gray-400">No admins found.</td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr key={admin._id} className="hover:bg-gray-50/70 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <ShieldCheck size={16} className="text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">{admin.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{admin.email}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                    Admin
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  {new Date(admin.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onToggleSuspend(admin)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm transition-all ${
                      admin.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    {admin.isActive ? "Active" : "Suspended"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(admin)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Admin"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(admin)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Admin"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button
          disabled={filters.page <= 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {filters.page} of {totalPages}
        </span>
        <button
          disabled={filters.page >= totalPages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminTable;

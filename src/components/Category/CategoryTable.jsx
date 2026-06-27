import React, { useState } from 'react';
import { Edit3, Trash2, ChevronRight, ChevronDown, FolderTree, Tag } from 'lucide-react';

const TableRow = ({ cat, level = 0, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;
  const isRootLevel = level === 0;

  return (
    <>
      <tr className="hover:bg-slate-50/50 transition-colors group border-b border-slate-100">
        <td className="px-6 py-4">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {hasChildren ? (
              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-1 text-slate-400 hover:text-[var(--color-secondary)] hover:bg-slate-50 rounded transition-colors"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <div className="w-6" /> 
            )}

            <div 
              style={{
                backgroundColor: isRootLevel ? "rgba(10, 71, 46, 0.06)" : "#F8FAFC",
                color: isRootLevel ? "var(--color-secondary)" : "#94A3B8",
                borderColor: isRootLevel ? "rgba(10, 71, 46, 0.12)" : "#E2E8F0"
              }}
              className="p-1.5 rounded-lg border transition-all"
            >
              {isRootLevel ? <FolderTree size={14} /> : <Tag size={14} />}
            </div>
            
            <div>
              <p className="text-sm font-bold text-slate-800">{cat.name}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">/{cat.slug}</p>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <span 
            style={
              cat.status === "Active" 
                ? { backgroundColor: "rgba(84, 180, 53, 0.08)", color: "var(--color-primary)", borderColor: "rgba(84, 180, 53, 0.15)" }
                : { backgroundColor: "#F1F5F9", color: "#94A3B8", borderColor: "#E2E8F0" }
            }
            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm"
          >
            {cat.status}
          </span>
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex justify-end gap-1 transition-opacity">
            <button 
              onClick={() => onEdit(cat)} 
              className="p-2 text-slate-400 hover:text-[var(--color-secondary)] hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-100 transition-all"
            >
              <Edit3 size={15} />
            </button>
            <button 
              onClick={() => onDelete(cat._id)} 
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-100 transition-all"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && hasChildren && cat.children.map((child) => (
        <TableRow key={child._id} cat={child} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </>
  );
};

const CategoryTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-[11px] uppercase font-black tracking-[0.1em]">
            <tr>
              <th className="px-6 py-5">Structure & Name</th>
              <th className="px-6 py-5 w-[150px]">Status</th>
              <th className="px-6 py-5 text-right w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data && data.length > 0 ? (
              data.map((cat) => (
                <TableRow key={cat._id} cat={cat} onEdit={onEdit} onDelete={onDelete} />
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <FolderTree size={48} />
                    <p className="text-lg font-bold uppercase tracking-tighter">No Categories Found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
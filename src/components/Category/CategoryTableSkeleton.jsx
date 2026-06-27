import React from 'react';

const CategoryTableSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="animate-pulse border-b border-slate-100">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-slate-100 rounded" />
              <div className="w-8 h-8 bg-slate-100 rounded" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-32" />
                <div className="h-2 bg-slate-50 rounded w-20" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-5 bg-slate-100 rounded-full w-16" />
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-end gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded" />
              <div className="w-8 h-8 bg-slate-100 rounded" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default CategoryTableSkeleton;
import React from "react";

const BlogSkeleton = () => {
  // Helper to render multiple table rows
  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="h-9 w-64 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-12 w-44 bg-gray-200 rounded-lg shadow-sm"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 w-20 bg-gray-100 rounded"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-12 bg-gray-100 rounded-lg"></div>
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-gray-100 rounded-lg"></div>
              <div className="h-12 w-32 bg-gray-100 rounded-lg"></div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Title",
                    "Category",
                    "Status",
                    "Views",
                    "Created",
                    "Actions",
                  ].map((text) => (
                    <th key={text} className="py-4 px-6 text-left">
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {skeletonRows.map((_, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="h-4 w-48 bg-gray-100 rounded"></div>
                        <div className="h-3 w-32 bg-gray-50 rounded"></div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 w-20 bg-blue-50 rounded-full"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-10 bg-gray-100 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-24 bg-gray-100 rounded"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
                        <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
                        <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer Skeleton */}
          <div className="border-t px-6 py-4 flex justify-between items-center">
            <div className="h-4 w-40 bg-gray-100 rounded"></div>
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-gray-100 rounded-lg"></div>
              <div className="h-9 w-9 bg-gray-100 rounded-lg"></div>
              <div className="h-9 w-20 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
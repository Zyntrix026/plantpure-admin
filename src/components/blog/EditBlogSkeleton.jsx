import React from "react";

const EditBlogSkeleton = () => {
  return (
    <div className="max-w-[1100px] space-y-8 pb-10 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>

      {/* Page Title */}
      <div className="h-9 w-48 bg-gray-200 rounded-lg"></div>

      {/* -------- BASIC INFO SKELETON -------- */}
      <div className="bg-white border rounded-xl p-6 space-y-6 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div
              className={`h-11 w-full bg-gray-100 rounded-lg ${i === 3 ? "h-24" : ""}`}
            ></div>
          </div>
        ))}
      </div>

      {/* -------- FEATURED IMAGE SKELETON -------- */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="h-4 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="border-2 border-dashed border-gray-100 rounded-lg p-4 h-[340px] flex flex-col items-center justify-center space-y-4">
          <div className="h-48 w-full max-w-[500px] bg-gray-100 rounded-md"></div>
          <div className="h-3 w-32 bg-gray-50 rounded"></div>
        </div>
      </div>

      {/* -------- CONTENT EDITOR SKELETON -------- */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
        {/* Toolbar Placeholder */}
        <div className="h-10 w-full bg-gray-100 rounded-t-lg border-b border-gray-200"></div>
        {/* Editor Body Placeholder */}
        <div className="h-96 w-full bg-gray-50 rounded-b-lg p-6 space-y-4">
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
          <div className="h-4 w-full bg-gray-100 rounded pt-4"></div>
          <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* -------- CATEGORY GRID SKELETON -------- */}
      <div className="bg-white border rounded-xl p-6 grid grid-cols-2 gap-6 shadow-sm">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-11 w-full bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* -------- AUTHOR GRID SKELETON -------- */}
      <div className="bg-white border rounded-xl p-6 grid grid-cols-2 gap-6 shadow-sm">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
            <div className="h-11 w-full bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* -------- SEO SETTINGS SKELETON -------- */}
      <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm">
        <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-gray-100 rounded"></div>
            <div
              className={`h-11 w-full bg-gray-50 rounded-lg ${i === 2 ? "h-20" : ""}`}
            ></div>
          </div>
        ))}
      </div>

      {/* -------- FOOTER ACTIONS SKELETON -------- */}
      <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200">
        <div className="flex items-center gap-6">
          <div className="h-11 w-40 bg-white border border-gray-200 rounded-lg shadow-sm"></div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-12 w-40 bg-gray-300 rounded-lg shadow-md"></div>
      </div>
    </div>
  );
};

export default EditBlogSkeleton;

import React from 'react';

const BlogDetailsSkeleton = () => {
  return (
    <div className="max-w-[1000px] animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-10 w-24 bg-gray-200 rounded-lg mb-6"></div>

      {/* Blog Header Skeleton */}
      <div className="mt-6 space-y-4">
        {/* Title Lines */}
        <div className="h-10 w-3/4 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-1/2 bg-gray-200 rounded-lg"></div>

        {/* Excerpt */}
        <div className="h-4 w-full bg-gray-100 rounded mt-4"></div>
        <div className="h-4 w-5/6 bg-gray-100 rounded"></div>

        {/* Author + Meta Bar */}
        <div className="flex items-center gap-4 mt-8">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="h-2 w-16 bg-gray-100 rounded"></div>
          </div>
          <div className="h-4 w-px bg-gray-200 mx-2 hidden md:block"></div>
          <div className="h-4 w-20 bg-gray-100 rounded hidden md:block"></div>
          <div className="h-4 w-20 bg-gray-100 rounded hidden md:block"></div>
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <div className="mt-10 h-[420px] w-full bg-gray-200 rounded-xl shadow-inner"></div>

      {/* Content Skeleton (Paragraphs) */}
      <div className="mt-12 space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-4/5 bg-gray-100 rounded"></div>
        </div>

        <div className="space-y-3 pt-4">
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
        </div>

        {/* Heading in content */}
        <div className="h-7 w-48 bg-gray-200 rounded mt-8"></div>

        <div className="space-y-3 pt-2">
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
        </div>
      </div>

      {/* Tags Skeleton */}
      <div className="mt-12">
        <div className="h-5 w-16 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-100 rounded-full"></div>
          <div className="h-8 w-24 bg-gray-100 rounded-full"></div>
          <div className="h-8 w-16 bg-gray-100 rounded-full"></div>
        </div>
      </div>

      {/* SEO Box Skeleton */}
      <div className="mt-12 p-6 border rounded-xl bg-gray-50/50 space-y-4">
        <div className="h-5 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-100 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
      </div>
    </div>
  );
};

export default BlogDetailsSkeleton;
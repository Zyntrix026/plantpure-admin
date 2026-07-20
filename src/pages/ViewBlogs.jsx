import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import {
  IoEyeOutline,
  IoTimeOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { getBlogById } from "../lib/blogApi";
import BlogDetailsSkeleton from "../components/blog/BlogDetailsSkeleton";

const ViewBlogs = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        if (res.success) {
          setBlog(res.blog);
        } else {
          setError("Failed to fetch blog data.");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Table Responsive Wrapper Logic
  useEffect(() => {
    if (blog) {
      const tables = document.querySelectorAll(".article-content table");
      tables.forEach((table) => {
        if (!table.parentElement?.classList.contains("table-wrapper")) {
          const wrapper = document.createElement("div");
          wrapper.className =
            "overflow-x-auto my-6 border border-gray-200 rounded-lg table-wrapper";
          table.parentNode?.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }
      });
    }
  }, [blog]);

  if (loading) return <BlogDetailsSkeleton />;
  if (error)
    return (
      <div className="max-w-4xl mx-auto p-10 text-red-500 bg-red-50 mt-10 rounded-lg border border-red-200">
        Error: {error}
      </div>
    );
  if (!blog) return null;

  const publishedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const primaryCategory = blog.categories?.[0] || {
    name: "General",
    slug: "general",
  };

  return (
    <div className="bg-gray-50 min-h-screen py-5">
      <main className="max-w-[1000px] mx-auto bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden px-6 md:px-12 py-10">
        {/* --- ADMIN ONLY: SEO PREVIEW PANEL --- */}
        <div className="mb-10 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold uppercase text-xs tracking-widest">
            <IoShieldCheckmarkOutline size={18} /> Admin SEO & Meta Preview
          </div>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className="font-bold text-gray-700">Meta Title:</span>
              <p className="text-gray-600">
                {blog.seo?.metaTitle || "Not Set"}
              </p>
            </div>
            <div>
              <span className="font-bold text-gray-700">Meta Description:</span>
              <p className="text-gray-600">
                {blog.seo?.metaDescription || "Not Set"}
              </p>
            </div>
            <div>
              <span className="font-bold text-gray-700">Keywords:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {blog.seo?.keywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px]"
                  >
                    {kw}
                  </span>
                )) || "None"}
              </div>
            </div>
            {blog.seo?.canonicalUrl && (
              <div>
                <span className="font-bold text-gray-700">Canonical URL:</span>
                <p className="text-blue-600 underline text-xs">
                  {`https://www.plantpure.in/${primaryCategory.slug || primaryCategory.name.toLowerCase()}/${blog.slug}`}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* --- END ADMIN PANEL --- */}

        {/* Category & Title */}
        <div className="mb-4">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-gray-200">
            {primaryCategory.name}
          </span>
        </div>

        <h1 className="text-gray-900 text-3xl md:text-5xl font-extrabold mb-6 leading-[1.2]">
          {blog.title}
        </h1>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg text-gray-500 mb-8 font-medium leading-relaxed italic border-l-4 border-gray-200 pl-4">
            {blog.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-5 text-gray-500 text-sm border-y border-gray-100 py-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              {blog.author?.name?.charAt(0)}
            </div>
            <span>
              By <strong className="text-gray-900">{blog.author?.name}</strong>
            </span>
          </div>
          <span className="hidden sm:block text-gray-300">|</span>
          <span>{publishedDate}</span>
          <div className="flex items-center gap-4 ml-auto">
            <span className="flex items-center gap-1">
              <IoEyeOutline /> {blog.views}
            </span>
            <span className="flex items-center gap-1">
              <IoTimeOutline /> {blog.readTime} min read
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <figure className="mb-10">
          <img
            src={blog.image?.url}
            alt={blog.image?.alt || blog.title}
            className="w-full h-auto rounded-lg shadow-sm border border-gray-100"
          />
          {blog.image?.alt && (
            <figcaption className="text-center text-xs text-gray-400 mt-3 italic">
              Alt Text: {blog.image.alt}
            </figcaption>
          )}
        </figure>

        {/* Content Body */}
        <article
          className="article-content prose prose-slate prose-lg max-w-none 
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-img:rounded-lg prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-widest">
              Post Tags:
            </h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-50 border border-gray-200 px-3 py-1 text-[11px] font-bold text-gray-500 rounded uppercase"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
      <div className="text-center mt-6 text-gray-400 text-xs font-medium">
        Preview Mode &copy; {new Date().getFullYear()} Admin Dashboard
      </div>
    </div>
  );
};

export default ViewBlogs;
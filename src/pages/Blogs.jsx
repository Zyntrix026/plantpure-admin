import React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { getBlogs, deleteBlog } from "../lib/blogApi";
import ConfirmModal from "../components/common/ConfirmModal";
import BlogHeroSection from "../components/blog/BlogHeroSection";
import BlogListContainer from "../components/blog/BlogListContainer";
import BlogSkeleton from "../components/blog/BlogSkeleton";
import { toast, ToastContainer } from "react-toastify";

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalStats, setTotalStats] = useState({ total: 0, published: 0, drafts: 0 });
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: "", title: "" });

  // Debounce search — 500ms
  const debounceRef = useRef(null);
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 500);
  };

  const fetchBlogs = useCallback(async (isInitial = false) => {
    try {
      isInitial ? setInitialLoading(true) : setLoading(true);
      const data = await getBlogs({
        page,
        limit: 10,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: debouncedSearch || undefined,
      });
      setBlogs(data.blogs || []);
      setTotalPages(data.pagination?.totalPages || data.totalPages || 1);
      setTotalStats({
        total: data.pagination?.totalBlogs ?? (data.blogs?.length || 0),
        published: data.publishedCount ?? (data.blogs?.filter((b) => b.status === "published").length || 0),
        drafts: data.draftCount ?? (data.blogs?.filter((b) => b.status === "draft").length || 0),
      });
    } catch (err) {
      toast.error(err.message || "Failed to load blogs");
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  // Initial load
  useEffect(() => { 
    fetchBlogs(true); 
  }, []);

  // Subsequent fetches (filter/search/page changes)
  useEffect(() => {
    if (initialLoading) return;
    fetchBlogs();
  }, [page, statusFilter, debouncedSearch]);

  // Reset page on filter or search change
  useEffect(() => { 
    setPage(1); 
  }, [statusFilter, debouncedSearch]);

  if (initialLoading) return <BlogSkeleton />;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <ToastContainer position="bottom-right" />
      <div>
        
        {/* Component 1: Hero & Stats */}
        <BlogHeroSection 
          total={totalStats.total} 
          published={totalStats.published}
          drafts={totalStats.drafts}
        />

        {/* Component 2: Filters + Table + Pagination */}
        <BlogListContainer 
          blogs={blogs}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
          onDelete={(id, title) => setDeleteModal({ open: true, id, title })}
          onRefresh={() => fetchBlogs()}
        />
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Confirm Delete"
        message={`Delete "${deleteModal.title}" permanently?`}
        onConfirm={async () => {
          await deleteBlog(deleteModal.id);
          toast.success("Blog removed");
          setDeleteModal({ open: false, id: "", title: "" });
          fetchBlogs();
        }}
        onClose={() => setDeleteModal({ open: false, id: "", title: "" })}
      />
    </div>
  );
};

export default AdminBlogsPage;
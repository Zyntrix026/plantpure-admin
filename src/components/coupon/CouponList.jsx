import React, { useState } from "react";
import { Edit2, Trash2, ChevronLeft, ChevronRight, Users, TrendingDown, Eye, X, Loader2 } from "lucide-react";
import { getCouponUsage } from "../../lib/coupon";

// ─── Usage History Drawer ──────────────────────────────────────────────────────
const UsageDrawer = ({ coupon, onClose }) => {
  const [usages, setUsages]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]     = useState(0);

  React.useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getCouponUsage(coupon._id, { page, limit: 8 });
        setUsages(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || 0);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, [coupon._id, page]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Usage History</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{coupon.code} — {total} total uses</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-gray-100">
          <div style={{ backgroundColor: "rgba(10, 71, 46, 0.05)" }} className="rounded-xl p-3 text-center">
            <p style={{ color: "var(--color-secondary)" }} className="text-[10px] font-black uppercase tracking-wider">Uses</p>
            <p style={{ color: "var(--color-secondary)" }} className="text-xl font-black">{coupon.usageCount}</p>
            <p className="text-[10px] text-slate-400">/ {coupon.usageLimit ?? "∞"}</p>
          </div>
          <div style={{ backgroundColor: "rgba(84, 180, 53, 0.08)" }} className="rounded-xl p-3 text-center">
            <p style={{ color: "var(--color-primary)" }} className="text-[10px] font-black uppercase tracking-wider">Saved</p>
            <p style={{ color: "var(--color-primary)" }} className="text-xl font-black">₹{(coupon.totalDiscountGiven || 0).toFixed(2)}</p>
            <p className="text-[10px] text-slate-400">total discount</p>
          </div>
          <div style={{ backgroundColor: "rgba(10, 71, 46, 0.05)" }} className="rounded-xl p-3 text-center">
            <p style={{ color: "var(--color-secondary)" }} className="text-[10px] font-black uppercase tracking-wider">Per Use</p>
            <p style={{ color: "var(--color-secondary)" }} className="text-xl font-black">
              ₹{coupon.usageCount > 0 ? ((coupon.totalDiscountGiven || 0) / coupon.usageCount).toFixed(2) : "0.00"}
            </p>
            <p className="text-[10px] text-slate-400">avg discount</p>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-gray-300" size={32} /></div>
          ) : usages.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">No usage records yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-black text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-[11px] font-black text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-right text-[11px] font-black text-gray-400 uppercase tracking-wider">Discount</th>
                  <th className="px-4 py-3 text-right text-[11px] font-black text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usages.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      {u.userId ? (
                        <div>
                          <p className="font-semibold text-gray-800 text-xs">{u.userId.name}</p>
                          <p className="text-gray-400 text-[11px]">{u.userId.email}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-amber-600 text-xs">Guest</p>
                          <p className="text-gray-400 text-[11px]">{u.guestEmail || "—"}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p style={{ color: "var(--color-secondary)" }} className="font-mono text-xs font-bold">{u.orderId?.orderNumber || "—"}</p>
                      {u.orderId?.totalPrice && <p className="text-[11px] text-gray-400">₹{u.orderId.totalPrice.toFixed(2)}</p>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span style={{ color: "var(--color-primary)" }} className="font-bold text-xs">-₹{u.discountAmount.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-[11px] text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-500 font-semibold">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main CouponList ───────────────────────────────────────────────────────────
const CouponList = ({ coupons, onToggleStatus, onEdit, onDelete, filters, setFilters, totalPages }) => {
  const [usageDrawer, setUsageDrawer] = useState(null);

  const usagePercent = (coupon) => {
    if (!coupon.usageLimit) return null;
    return Math.min(100, Math.round((coupon.usageCount / coupon.usageLimit) * 100));
  };

  return (
    <>
      {usageDrawer && <UsageDrawer coupon={usageDrawer} onClose={() => setUsageDrawer(null)} />}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
              <th className="p-4">Code</th>
              <th className="p-4">Type / Value</th>
              <th className="p-4">Usage</th>
              <th className="p-4">Discount Given</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {coupons.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-gray-400">No coupons found matching criteria.</td></tr>
            ) : (
              coupons.map((coupon) => {
                const pct     = usagePercent(coupon);
                const expired = new Date(coupon.expiryDate) < new Date();

                return (
                  <tr key={coupon._id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Code */}
                    <td className="p-4">
                      <span style={{ color: "var(--color-secondary)" }} className="font-mono font-black bg-slate-100 px-2 py-1 rounded-lg text-sm tracking-wider">
                        {coupon.code}
                      </span>
                    </td>

                    {/* Type / Value */}
                    <td className="p-4">
                      <p className="font-semibold capitalize text-gray-700">{coupon.type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {coupon.type === "percentage" ? `${coupon.value}% off${coupon.maxDiscount ? ` (max ₹${coupon.maxDiscount})` : ""}`
                          : coupon.type === "free_shipping" ? "Free Shipping"
                          : `₹${coupon.value} off`}
                        {coupon.minOrderAmount > 0 && <span className="ml-1 text-gray-300">· min ₹{coupon.minOrderAmount}</span>}
                      </p>
                    </td>

                    {/* Usage with progress */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users size={13} className="text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">
                            {coupon.usageCount}
                            <span className="font-normal text-gray-400 text-xs ml-1">/ {coupon.usageLimit ?? "∞"}</span>
                          </p>
                          {pct !== null && (
                            <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${pct}%`,
                                  backgroundColor: pct >= 90 ? "#F43F5E" : pct >= 60 ? "#F59E0B" : "var(--color-primary)"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Total discount given */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <TrendingDown size={13} style={{ color: "var(--color-primary)" }} className="flex-shrink-0" />
                        <span style={{ color: "var(--color-primary)" }} className="font-bold">₹{(coupon.totalDiscountGiven || 0).toFixed(2)}</span>
                      </div>
                    </td>

                    {/* Expiry */}
                    <td className="p-4">
                      <span className={`text-sm ${expired ? "text-rose-500 font-semibold" : "text-gray-500"}`}>
                        {new Date(coupon.expiryDate).toLocaleDateString("en-GB")}
                      </span>
                      {expired && <p className="text-[10px] text-rose-400 font-bold">EXPIRED</p>}
                    </td>

                    {/* Status toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => onToggleStatus(coupon._id)}
                        style={coupon.isActive ? { backgroundColor: "rgba(84, 180, 53, 0.12)", color: "var(--color-primary)" } : {}}
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-all ${
                          coupon.isActive ? "" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setUsageDrawer(coupon)}
                          className="p-1.5 text-gray-400 hover:text-[var(--color-secondary)] hover:bg-slate-50 rounded-lg transition-colors"
                          title="View Usage History"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => onEdit(coupon)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(coupon._id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-sm text-gray-500 font-semibold">Page {filters.page} of {totalPages}</span>
          <button
            disabled={filters.page >= totalPages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 flex items-center gap-1"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default CouponList;
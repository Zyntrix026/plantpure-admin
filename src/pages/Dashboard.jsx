import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  Wallet,
  Calendar,
  MessageSquare,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { getDashboardStats } from "../lib/dashboard";
import { Link } from "react-router-dom";

// --- PROFESSIONAL MINIMALIST SKELETON LOADER ---
const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-pulse">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-40 bg-slate-200 rounded-xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-36"
          >
            <div className="w-10 h-10 bg-slate-200 rounded-xl mb-4"></div>
            <div className="h-3 w-20 bg-slate-200 rounded mb-2"></div>
            <div className="h-5 w-28 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-8 h-[400px]"></div>
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-8 h-[400px]"></div>
      </div>
    </div>
  );
};

// --- CORE DASHBOARD COMPONENT ---
const FigmaDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateStr, setCurrentDateStr] = useState("");

  useEffect(() => {
    const formatLiveDate = () => {
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      setCurrentDateStr(new Date().toLocaleDateString("en-GB", options));
    };
    formatLiveDate();

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getDashboardStats();
        if (res?.success) {
          setData(res.data);
        } else {
          setError("Failed to resolve dashboard metrics payload.");
        }
      } catch (err) {
        setError(err.message || "Network synchronization dropped.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center text-slate-600">
        <div className="p-3.5 bg-rose-50 text-rose-500 rounded-full mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-medium text-slate-800">
          Sync Pipeline Error
        </h3>
        <p className="text-sm text-slate-400 max-w-xs mt-1 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ backgroundColor: "var(--color-secondary)" }}
          className="px-4 py-2 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90 shadow-sm"
        >
          Reconnect System
        </button>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalCustomers = 0,
    totalCategories = 0,
    totalAdmins = 0,
    totalReviews = 0,
    activeReviews = 0,
    outOfStockProducts = 0,
    orderStatus = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    topSellingProducts = [],
    recentOrders = [],
    weeklyOrders = [],
    last6MonthsRevenue = [],
  } = data || {};

  // Transform runtime timeline feeds for charting pipeline
  const revenueChartData = last6MonthsRevenue.map((item) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthLabel = item._id?.month ? months[item._id.month - 1] : "";
    return {
      date: `${monthLabel} ${item._id?.year || ""}`,
      revenue: item.revenue || 0,
      orders: item.orders || 0,
    };
  });

  // Dynamic status mapping sequence using the theme variables
  const orderFunnelData = [
    {
      name: "Confirmed",
      value: orderStatus.confirmed,
      fill: "var(--color-primary)",
    },
    {
      name: "Pending",
      value: orderStatus.pending,
      fill: "var(--color-secondary)",
    },
    { name: "Shipped", value: orderStatus.shipped, fill: "#CBD5E1" },
    { name: "Delivered", value: orderStatus.delivered, fill: "#F1F5F9" },
    { name: "Cancelled", value: orderStatus.cancelled, fill: "#F8FAFC" },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-600 antialiased font-sans text-sm pb-12">
      <main className="max-w-[1400px] mx-auto ">
        {/* --- EXECUTIVE APP HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Executive Dashboard
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center bg-white px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm text-slate-500 font-medium text-xs tracking-wide">
            <Calendar size={15} style={{ color: "var(--color-primary)" }} />
            <span>{currentDateStr}</span>
          </div>
        </div>

        {/* --- DYNAMIC METRIC CARDS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            label="Total Revenue"
            value={`₹
${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<Wallet />}
            badge={`Monthly: ₹
${data?.monthlyRevenue || 0}`}
            color="dark"
            link=""
          />
          <StatCard
            label="Total Orders"
            value={totalOrders.toLocaleString()}
            icon={<ShoppingCart />}
            badge={`Today: ${data?.todayOrders || 0}`}
            color="dark"
            link="/admin/orders"
          />
          {/* <StatCard
            label="Total Categories"
            value={data.totalCategories || 0}
            icon={<Package />}
            badge={null}
            color="dark"
            link="/admin/categories"
          />
          <StatCard
            label=" Active Admin "
            value={totalAdmins.toLocaleString()}
            icon={<Users />}
            badge={null}
            color="dark"
            link="/admin/admin-managemenet"
          /> */}
          <StatCard
            label=" Active Customer "
            value={totalCustomers.toLocaleString()}
            icon={<Users />}
            badge={null}
            color="dark"
            link="/admin/customer"
          />
        </div>

        {/* --- SUB-METRIC MATRIX STRIP --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/review">
            <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Total Reviews
              </p>
              <p className="text-base font-semibold text-slate-800 mt-0.5">
                {totalReviews}
              </p>
            </div>
          </Link>
          <Link to="/admin/review">
            <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Active Reviews
              </p>
              <p
                style={{ color: "var(--color-primary)" }}
                className="text-base font-semibold mt-0.5"
              >
                {activeReviews}
              </p>
            </div>
          </Link>
          <Link to="/admin/products">
            <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Total Products
              </p>
              <p className={`text-base font-semibold mt-0.5 text-slate-800`}>
                {totalProducts}
              </p>
            </div>
          </Link>
          <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Today's Revenue
            </p>
            <p className="text-base font-semibold text-emerald-600 mt-0.5">
              ₹{data?.todayRevenue || 0}
            </p>
          </div>
        </div>

        {/* --- MAIN CORE ANALYTICS GRAPH COMPONENT --- */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-8">
          {/* REVENUE TIMELINE PLOT */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Revenue over time
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Comparison between revenue and order volume
                </p>
              </div>
            </div>

            <div className="h-[340px] w-full">
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueChartData}
                    margin={{ left: -15, right: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-primary)"
                          stopOpacity={0.08}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F1F5F9"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                      name="Revenue (₹)"
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#94A3B8"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill="none"
                      name="Orders Count"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 text-xs">
                  No adequate transactional timeline recorded.
                </div>
              )}
            </div>
          </div>

          {/* WEEKLY OPERATIONS LOGIC CARD */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8 flex flex-col">
            <h3 className="text-base font-semibold text-slate-800">
              Weekly Target
            </h3>
            <p className="text-slate-400 text-xs mt-0.5 mb-6">
              Pipeline processing analytics
            </p>

            <div className="flex-1 flex flex-col justify-center space-y-3.5">
              {weeklyOrders.length > 0 ? (
                weeklyOrders.map((w, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl transition-all hover:bg-slate-100/50"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {w._id}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {w.count} transactions processed
                      </p>
                    </div>
                    <span className="text-sm font-medium text-slate-800">
                      ₹{w.revenue.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-300 text-center text-xs py-8">
                  No structured weekly transactions mapped.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- INVENTORY AND SALES FUNNEL ANALYSIS ROW --- */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* FUNNEL DISPLAY */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8">
            <h3 className="text-base font-semibold text-slate-800">
              Sales Funnel
            </h3>
            <p className="text-slate-400 text-xs mt-0.5 mb-8">
              Realtime status processing weights
            </p>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderFunnelData}
                  layout="vertical"
                  margin={{ left: -10, right: 10 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontWeight: 500, fontSize: 12 }}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {orderFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div
                className="p-3 border rounded-xl text-center"
                style={{
                  backgroundColor: "rgba(10, 71, 46, 0.04)",
                  borderColor: "rgba(10, 71, 46, 0.1)",
                }}
              >
                <span
                  style={{ color: "var(--color-secondary)" }}
                  className="text-[11px] font-medium tracking-wider uppercase block"
                >
                  Pending Nodes
                </span>
                <span
                  style={{ color: "var(--color-secondary)" }}
                  className="text-lg font-medium block mt-0.5"
                >
                  {orderStatus.pending}
                </span>
              </div>
              <div
                className="p-3 border rounded-xl text-center"
                style={{
                  backgroundColor: "rgba(84, 180, 53, 0.06)",
                  borderColor: "rgba(84, 180, 53, 0.15)",
                }}
              >
                <span
                  style={{ color: "var(--color-primary)" }}
                  className="text-[11px] font-medium tracking-wider uppercase block"
                >
                  Confirmed Nodes
                </span>
                <span
                  style={{ color: "var(--color-primary)" }}
                  className="text-lg font-medium block mt-0.5"
                >
                  {orderStatus.confirmed}
                </span>
              </div>
            </div>
          </div>

          {/* HIGH CONVERSION MARKET TOP SELLERS */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8">
            <h3 className="text-base font-semibold text-slate-800">
              Top Locations
            </h3>
            <p className="text-slate-400 text-xs mt-0.5 mb-6">
              Marketplace items producing highest velocity value
            </p>

            <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto pr-1">
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={p.image}
                        alt=""
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/60x60?text=Asset";
                        }}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate max-w-[240px] md:max-w-md">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {p.totalSold} operational units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-semibold text-slate-800 block">
                        ₹{p.totalRevenue.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block mt-0.5">
                        Gross Revenue
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-300 text-center py-12 text-xs">
                  No dynamic sales arrays parsed.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- SYSTEM HISTORICAL TRANSACTION LOGS TABLE --- */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 md:p-8 mt-8 overflow-hidden">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-800">
              Recent Transactions
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Chronological list of invoice operations processed in pipeline
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="p-4">Invoice Cluster</th>
                  <th className="p-4">Customer Account</th>
                  <th className="p-4">Log Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-xs font-normal">
                {recentOrders.length > 0 ? (
                  recentOrders.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-800 flex items-center gap-2">
                        <FileText size={14} className="text-slate-300" />
                        {item.orderNumber}
                      </td>
                      <td className="p-4 capitalize">
                        {item.shippingAddress?.fullName || "Anonymous Buyer"}
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                            item.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-slate-800">
                        ₹{item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-10 text-center text-slate-300 text-xs"
                    >
                      No invoices currently online.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HANDCRAFTED REUSABLE COMPACT WIDGET ---
const StatCard = ({ label, value, icon, badge, color, link }) => {
  return (
    <Link to={link}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-36">
        <div className="flex justify-between items-start">
          {/* Box styled with secondary corporate theme color */}
          <div
            style={{ backgroundColor: "var(--color-secondary)" }}
            className="p-2.5 rounded-xl text-white shadow-sm shadow-slate-900/10"
          >
            {React.cloneElement(icon, { size: 18 })}
          </div>
          {badge && (
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-md max-w-[150px] truncate">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-2">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            {label}
          </p>
          <h2 className="text-xl md:text-2xl font-medium mt-0.5 text-slate-800 tracking-tight truncate">
            {value}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default FigmaDashboard;

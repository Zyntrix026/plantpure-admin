import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, User, CreditCard, ShoppingBag, X, CheckCircle2, Clock, ExternalLink, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getProducts } from "../lib/product";
import { createManualOrder, getAllOrdersAdmin } from "../lib/orders";
import { useNavigate } from "react-router-dom";

// ── Validators ────────────────────────────────────────────────────────────────
const validate = {
  fullName: (v) => (!v.trim() ? "Full name is required" : v.trim().length < 2 ? "Enter a valid name" : ""),
  phone: (v) => {
    const d = v.replace(/\D/g, "");
    if (!d) return "Phone is required";
    if (d.length !== 10) return "Phone must be 10 digits";
    if (/^(\d)\1{9}$/.test(d)) return "Invalid phone number";
    return "";
  },
  email: (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Enter a valid email" : ""),
  postalCode: (v) => (v && !/^\d{6}$/.test(v.trim()) ? "Enter a valid 6-digit pincode" : ""),
};

// ── ManualOrder Page ──────────────────────────────────────────────────────────
const ManualOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getAllOrdersAdmin({ limit: 50, page: 1 })
      .then((res) => setOrders(res.orders || []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoadingOrders(false));
  }, []);

  const filteredOrders = orders.filter((ord) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      ord.orderNumber?.toLowerCase().includes(q) ||
      ord.shippingAddress?.fullName?.toLowerCase().includes(q) ||
      ord.shippingAddress?.phone?.includes(q) ||
      ord.guestEmail?.toLowerCase().includes(q);
    if (filterStatus === "all") return matchSearch;
    return matchSearch && ord.paymentStatus === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">View all orders or create manual offline orders.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-primary/90 transition-all active:scale-95 shrink-0"
        >
          <Plus size={18} /> Create Manual Order
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "paid", "pending"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === s ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase text-gray-500 tracking-wider">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loadingOrders ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto text-primary" size={28} />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{ord.orderNumber}</span>
                        {ord.isManualOrder && (
                          <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-100">
                            Manual
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-800">{ord.shippingAddress?.fullName || ord.guestEmail || "Guest"}</p>
                      <p className="text-xs text-gray-400">{ord.shippingAddress?.phone}</p>
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-gray-600">{ord.orderItems?.length || 0} item(s)</td>
                    <td className="py-4 px-6 font-bold text-gray-900">₹{Number(ord.totalPrice).toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{ord.paymentMethod}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          ord.paymentStatus === "paid" ? "bg-green-50 text-green-700 border border-green-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {ord.paymentStatus === "paid" ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                        {ord.paymentStatus?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${ord._id}`)}
                        className="text-gray-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CreateOrderModal
          onClose={() => setIsModalOpen(false)}
          onOrderCreated={(newOrd) => {
            setOrders((prev) => [newOrd, ...prev]);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// ── Create Order Modal ────────────────────────────────────────────────────────
const CreateOrderModal = ({ onClose, onOrderCreated }) => {
  const [productQuery, setProductQuery] = useState("");
  const [productResults, setProductResults] = useState([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const searchContainerRef = useRef(null);
  const searchTimeout = useRef(null);

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    country: "India",
  });

  const [shippingFee, setShippingFee] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("UPI_DIRECT");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [transactionId, setTransactionId] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [shippingMethod, setShippingMethod] = useState("delivery");

  // Debounced API Search with Click Outside Support
  useEffect(() => {
    if (!productQuery.trim()) {
      setProductResults([]);
      setIsDropdownOpen(false);
      return;
    }

    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setSearchingProducts(true);
      try {
        const res = await getProducts({ search: productQuery, limit: 10 });
        // Handling response payload structure (res.data vs res.products)
        const productsList = res?.data || res?.products || [];
        setProductResults(productsList);
        setIsDropdownOpen(true);
      } catch (error) {
        setProductResults([]);
      } finally {
        setSearchingProducts(false);
      }
    }, 350);

    return () => clearTimeout(searchTimeout.current);
  }, [productQuery]);

  // Click Outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const errors = {
    fullName: validate.fullName(customer.fullName),
    phone: validate.phone(customer.phone),
    email: validate.email(customer.email),
    postalCode: validate.postalCode(customer.postalCode),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleBlur = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const inputCls = (field) =>
    `w-full border rounded-xl p-3 text-sm outline-none focus:border-primary transition-all ${
      touched[field] && errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"
    }`;

  // Helper function to extract price based on API structure
  const getProductPrice = (product, variant = null) => {
    if (variant) {
      return variant.discountPrice ?? variant.price ?? variant.prices?.excludeVat?.discount ?? 0;
    }
    return (
      product.discountPrice ??
      product.prices?.excludeVat?.discount ??
      product.prices?.includeVat?.discount ??
      product.basePrice ??
      product.prices?.excludeVat?.base ??
      0
    );
  };

  const handleAddProduct = (product, variantId = null) => {
    const key = variantId ? `${product._id}_${variantId}` : product._id;
    const existing = cartItems.findIndex((i) => i._key === key);

    let price, variantLabel, stock, image;
    image = product.thumbnail || product.images?.[0]?.url || "";

    if (product.hasVariants && variantId) {
      const v = product.variants?.find((v) => v._id === variantId || v._id?.toString() === variantId);
      price = getProductPrice(product, v);
      variantLabel = v?.label;
      stock = v?.stock ?? 0;
    } else {
      price = getProductPrice(product);
      stock = product.stock ?? 0;
    }

    if (existing > -1) {
      const updated = [...cartItems];
      if (updated[existing].quantity >= stock) {
        toast.error(`Only ${stock} units available`);
        return;
      }
      updated[existing].quantity += 1;
      setCartItems(updated);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          _key: key,
          productId: product._id,
          variantId: variantId || null,
          name: variantLabel ? `${product.title} — ${variantLabel}` : product.title,
          image,
          price,
          stock,
          quantity: 1,
          variantLabel,
        },
      ]);
    }

    // Reset Search & Close Dropdown
    setProductQuery("");
    setProductResults([]);
    setIsDropdownOpen(false);
  };

  const updateQty = (key, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._key !== key) return item;
          const newQty = item.quantity + delta;
          if (newQty < 1) return null;
          if (newQty > item.stock) {
            toast.error(`Only ${item.stock} units available`);
            return item;
          }
          return { ...item, quantity: newQty };
        })
        .filter(Boolean)
    );
  };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const grandTotal = Math.max(0, subtotal + Number(shippingFee) - Number(discountAmount));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ fullName: true, phone: true, email: true, postalCode: true });

    if (hasErrors) {
      toast.error("Please fix all validation errors.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Add at least one product.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createManualOrder({
        customer,
        items: cartItems.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
        paymentMethod,
        paymentStatus,
        shippingFee: Number(shippingFee),
        discountAmount: Number(discountAmount),
        transactionId,
        adminNotes,
        shippingMethod,
      });

      if (!res.success) throw new Error(res.message);
      toast.success(`Order ${res.data.orderNumber} created successfully!`);
      onOrderCreated({
        ...res.data,
        shippingAddress: customer,
        isManualOrder: true,
        orderItems: cartItems,
        totalPrice: grandTotal,
        paymentMethod,
        paymentStatus,
      });
    } catch (err) {
      toast.error(err.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Create Manual Order</h2>
            <p className="text-xs text-gray-500">Record payments made via UPI, Bank Transfer, or Cash.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. CUSTOMER INFO */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <User size={14} /> Customer Information
              </h3>

              <div>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  onBlur={() => handleBlur("fullName")}
                  className={inputCls("fullName")}
                />
                {touched.fullName && errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone * (10 digits)"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    onBlur={() => handleBlur("phone")}
                    className={inputCls("phone")}
                  />
                  {touched.phone && errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email (for confirmation)"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    onBlur={() => handleBlur("email")}
                    className={inputCls("email")}
                  />
                  {touched.email && errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <input
                type="text"
                placeholder="Street Address"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary"
                />
                <div>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                    onBlur={() => handleBlur("postalCode")}
                    className={inputCls("postalCode")}
                  />
                  {touched.postalCode && errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="State"
                  value={customer.state}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary"
                />
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white"
                >
                  <option value="delivery">Home Delivery</option>
                  <option value="store_pickup">Store Pickup</option>
                </select>
              </div>
            </div>

            {/* 2. PAYMENT */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <CreditCard size={14} /> Payment Details
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white font-medium"
                  >
                    <option value="UPI_DIRECT">Direct UPI / QR</option>
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT)</option>
                    <option value="CASH">Cash</option>
                    <option value="COD">Pay on Delivery (COD)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none bg-white font-medium"
                  >
                    <option value="paid">PAID</option>
                    <option value="pending">PENDING</option>
                  </select>
                </div>
              </div>

              <input
                type="text"
                placeholder="Transaction ID / UPI Ref No."
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary"
              />

              <textarea
                rows={3}
                placeholder="Admin Notes (internal reference)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary resize-none"
              />

              {/* Totals */}
              <div className="bg-gray-50 p-4 rounded-2xl space-y-3 border border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Shipping Fee (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-primary text-lg">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. PRODUCT SEARCH WITH AUTO-SUGGEST & SELECTION */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <ShoppingBag size={14} /> Add Products
            </h3>

            <div className="relative" ref={searchContainerRef}>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              {searchingProducts && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={16} />}
              <input
                type="text"
                placeholder="Search products by title, SKU..."
                value={productQuery}
                onFocus={() => productResults.length > 0 && setIsDropdownOpen(true)}
                onChange={(e) => setProductQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary transition-all"
              />

              {/* Suggestion Box */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-30 divide-y divide-gray-100">
                  {productResults.length === 0 ? (
                    <div className="p-3 text-xs text-gray-400 text-center">No matching products found</div>
                  ) : (
                    productResults.map((prod) => {
                      const img = prod.thumbnail || prod.images?.[0]?.url;
                      const basePrice = getProductPrice(prod);

                      return (
                        <div key={prod._id} className="hover:bg-gray-50 transition-colors">
                          {/* Standard Product */}
                          {!prod.hasVariants && (
                            <div onClick={() => handleAddProduct(prod)} className="p-3 cursor-pointer flex justify-between items-center gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                {img ? (
                                  <img src={img} className="w-10 h-10 object-cover rounded-lg shrink-0 border border-gray-100" alt="" />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-gray-400">
                                    <ShoppingBag size={18} />
                                  </div>
                                )}
                                <div className="truncate">
                                  <p className="text-sm font-semibold text-gray-800 truncate">{prod.title}</p>
                                  <p className="text-xs text-gray-400">
                                    SKU: {prod.sku || "N/A"} • Stock: <span className="font-semibold text-gray-600">{prod.stock}</span>
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-bold text-primary shrink-0">₹{basePrice}</span>
                            </div>
                          )}

                          {/* Variant Product */}
                          {prod.hasVariants &&
                            prod.variants?.map((v) => {
                              const varPrice = getProductPrice(prod, v);
                              return (
                                <div
                                  key={v._id}
                                  onClick={() => handleAddProduct(prod, v._id?.toString())}
                                  className="p-3 cursor-pointer flex justify-between items-center gap-3 pl-8 hover:bg-gray-100/80"
                                >
                                  <div className="truncate">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                      {prod.title} — <span className="text-primary">{v.label}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      Stock: <span className="font-semibold text-gray-600">{v.stock}</span>
                                    </p>
                                  </div>
                                  <span className="text-sm font-bold text-primary shrink-0">₹{varPrice}</span>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <p className="text-center py-4 text-xs text-gray-400 border border-dashed rounded-xl">No items added. Search above to add products.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item._key} className="flex items-center justify-between p-2.5 border border-gray-100 rounded-xl bg-gray-50/60">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.image ? (
                        <img src={item.image} className="w-9 h-9 object-cover rounded-lg shrink-0 border border-gray-200" alt="" />
                      ) : (
                        <div className="w-9 h-9 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-gray-400">
                          <ShoppingBag size={16} />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400">₹{item.price} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button type="button" onClick={() => updateQty(item._key, -1)} className="px-2.5 py-1 text-xs font-bold hover:bg-gray-100 rounded-l-lg">
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button type="button" onClick={() => updateQty(item._key, 1)} className="px-2.5 py-1 text-xs font-bold hover:bg-gray-100 rounded-r-lg">
                          +
                        </button>
                      </div>
                      <span className="text-xs font-bold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => setCartItems((p) => p.filter((i) => i._key !== item._key))}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-md hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating...
                </>
              ) : (
                "Confirm & Create Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualOrder;
import React, { useRef } from "react";
import {
  X,
  Printer,
  FileText,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const PrintReceiptModal = ({ isOpen, onClose, order }) => {
  const invoiceRef = useRef(null);

  if (!isOpen || !order) return null;

  const shipping = order.shippingAddress || {};
  const isGuest = order.isGuest;
  const customerEmail = isGuest ? order.guestEmail : order.userId?.email;
  const customerPhone = isGuest ? shipping.phone : order.userId?.phone || shipping.phone;

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=850,height=1000");
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to print.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.orderNumber}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #1e293b;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .invoice-box {
              max-width: 800px;
              margin: 0 auto;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .brand-name {
              font-size: 24px;
              font-weight: 900;
              color: #0f172a;
              letter-spacing: -0.5px;
            }
            .invoice-title {
              font-size: 20px;
              font-weight: 800;
              text-align: right;
              color: #4f46e5;
            }
            .address-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 24px;
            }
            .addr-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px;
              font-size: 12px;
              line-height: 1.5;
            }
            .addr-title {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              color: #64748b;
              margin-bottom: 4px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 12px;
            }
            .items-table th {
              background: #0f172a;
              color: #fff;
              font-weight: 700;
              text-align: left;
              padding: 8px 12px;
            }
            .items-table td {
              padding: 10px 12px;
              border-bottom: 1px solid #e2e8f0;
            }
            .summary-table {
              width: 320px;
              margin-left: auto;
              border-collapse: collapse;
              font-size: 12px;
            }
            .summary-table td {
              padding: 6px 12px;
            }
            .grand-total {
              font-size: 15px;
              font-weight: 900;
              background: #f1f5f9;
              border-top: 2px solid #0f172a;
            }
            .footer-note {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              font-size: 10px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <FileText className="text-indigo-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black">Tax Invoice & Packing Receipt</h3>
              <p className="text-xs text-slate-300">Order #{order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Invoice Preview */}
        <div className="p-6 bg-slate-100/50 max-h-[70vh] overflow-y-auto">
          <div
            ref={invoiceRef}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 text-slate-900 text-xs"
          >
            {/* Header info */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-5">
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">PLANTPURE</h1>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Pure Natural Wellness Products</p>
                <p className="text-[10px] text-slate-400 mt-1">support@plantpure.in • +91 9810999976</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-indigo-600 uppercase tracking-wide">RETAIL INVOICE</span>
                <p className="text-xs font-mono font-bold text-slate-800 mt-1">Invoice: INV-{order.orderNumber}</p>
                <p className="text-[11px] text-slate-500">
                  Date: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Address Grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  SHIPPED & BILLED TO:
                </span>
                <p className="font-bold text-sm text-slate-900">{shipping.fullName || "Customer"}</p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  {shipping.address}, {shipping.city}
                </p>
                <p className="text-[11px] text-slate-600">
                  {shipping.state} - {shipping.postalCode}, India
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  📞 {customerPhone} {customerEmail && `• ✉️ ${customerEmail}`}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  ORDER & PAYMENT:
                </span>
                <p className="text-[11px] text-slate-700">
                  <span className="font-bold">Payment Method:</span> {order.paymentMethod}
                </p>
                <p className="text-[11px] text-slate-700 mt-0.5">
                  <span className="font-bold">Payment Status:</span>{" "}
                  <span className={`capitalize font-bold ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.paymentStatus}
                  </span>
                </p>
                <p className="text-[11px] text-slate-700 mt-0.5">
                  <span className="font-bold">Delivery Method:</span>{" "}
                  <span className="capitalize">{order.shippingMethod?.replace('_', ' ')}</span>
                </p>
                {order.trackingDetails?.trackingNumber && (
                  <p className="text-[11px] text-slate-700 mt-0.5 font-mono">
                    <span className="font-bold font-sans">AWB No:</span> {order.trackingDetails.trackingNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-5">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">SKU</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {(order.orderItems || []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">{item.sku || "—"}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{item.priceAtPurchase?.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Summary */}
            <div className="flex justify-end mb-4">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold">₹{order.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee:</span>
                  <span className="font-mono font-semibold">
                    {order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice?.toFixed(2)}`}
                  </span>
                </div>
                {order.coupon?.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount:</span>
                    <span className="font-mono">-₹{order.coupon.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                  <span>Total Amount:</span>
                  <span className="font-mono text-indigo-600">₹{order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="text-center border-t border-dashed border-slate-200 pt-3 text-[10px] text-slate-400">
              Thank you for ordering with PlantPure! For customer assistance, please reach out to care@plantpure.in.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 text-xs transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-black rounded-xl shadow-lg text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer size={15} /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintReceiptModal;


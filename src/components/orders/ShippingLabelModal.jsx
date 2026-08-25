import React, { useRef } from "react";
import {
  X,
  Printer,
  Download,
  ExternalLink,
  Barcode,
  Truck,
  Package,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ShippingLabelModal = ({ isOpen, onClose, order, labelData }) => {
  const printRef = useRef(null);

  if (!isOpen || !order) return null;

  const data = labelData || {};
  const tracking = order.trackingDetails || {};
  const waybill = data.waybill || tracking.trackingNumber || "N/A";
  const courierName = data.courierName || tracking.courierName || "Delhivery";
  const labelPdfUrl = data.labelUrl || tracking.labelUrl;
  const isCOD = order.paymentMethod === "COD";
  const shipping = order.shippingAddress || {};

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to print.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shipping Label - ${waybill}</title>
          <style>
            @page {
              size: 4in 6in;
              margin: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 12px;
              color: #000;
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .label-card {
              border: 2px solid #000;
              padding: 10px;
              max-width: 380px;
              margin: 0 auto;
              box-sizing: border-box;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #000;
              padding-bottom: 6px;
              margin-bottom: 8px;
            }
            .logo-title {
              font-size: 16px;
              font-weight: 900;
              letter-spacing: 1px;
            }
            .courier-badge {
              font-size: 13px;
              font-weight: 800;
              text-transform: uppercase;
            }
            .barcode-box {
              text-align: center;
              padding: 6px 0;
              border-bottom: 2px solid #000;
              margin-bottom: 8px;
            }
            .barcode-lines {
              display: flex;
              justify-content: center;
              gap: 2px;
              height: 48px;
              margin-bottom: 4px;
            }
            .bar {
              background: #000;
              height: 100%;
            }
            .awb-text {
              font-family: monospace;
              font-size: 16px;
              font-weight: 900;
              letter-spacing: 2px;
            }
            .section {
              border-bottom: 1.5px solid #000;
              padding-bottom: 6px;
              margin-bottom: 6px;
            }
            .section-title {
              font-size: 9px;
              font-weight: 900;
              text-transform: uppercase;
              color: #444;
              margin-bottom: 2px;
            }
            .name {
              font-size: 13px;
              font-weight: 800;
            }
            .address {
              font-size: 11px;
              line-height: 1.3;
              margin: 2px 0;
            }
            .pincode-highlight {
              font-size: 14px;
              font-weight: 900;
              display: inline-block;
              margin-top: 2px;
            }
            .pay-mode {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border: 2px solid #000;
              padding: 6px 10px;
              margin: 8px 0;
              font-weight: 900;
              font-size: 14px;
            }
            .pay-cod {
              background: #000;
              color: #fff;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4px;
              font-size: 10px;
              border-bottom: 1px solid #000;
              padding-bottom: 6px;
              margin-bottom: 6px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin-top: 4px;
            }
            .items-table th {
              text-align: left;
              border-bottom: 1px solid #000;
              font-size: 9px;
              padding: 2px;
            }
            .items-table td {
              padding: 2px;
            }
            .footer {
              font-size: 8px;
              text-align: center;
              margin-top: 6px;
              color: #555;
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
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Printer className="text-indigo-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black">Shipping Label Preview</h3>
              <p className="text-xs text-slate-300">
                AWB: <span className="font-mono font-bold text-white">{waybill}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Label Display Card */}
        <div className="p-6 bg-slate-100/70 flex justify-center">
          <div
            ref={printRef}
            className="bg-white border-2 border-black rounded-lg p-5 w-full max-w-[380px] shadow-md text-black select-all"
            style={{ fontFamily: 'monospace, sans-serif' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
              <div>
                <h1 className="text-base font-black tracking-wider uppercase">PLANTPURE</h1>
                <p className="text-[9px] text-gray-600 font-sans">Official Store Logistics</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black uppercase bg-black text-white px-2 py-0.5 rounded">
                  {courierName}
                </span>
                <p className="text-[9px] font-sans text-gray-600 mt-0.5">
                  {tracking.shippingMode || "Surface"}
                </p>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="border-b-2 border-black pb-3 mb-3 text-center">
              <div className="flex justify-center items-end h-12 gap-[2px] mx-auto px-4 bg-gray-50 py-1">
                {waybill.split("").map((char, i) => {
                  const val = char.charCodeAt(0) % 5;
                  const widths = ["w-[1px]", "w-[2px]", "w-[3px]", "w-[1.5px]", "w-[4px]"];
                  return (
                    <div
                      key={i}
                      className={`bg-black h-full ${widths[val]} ${i % 3 === 0 ? "opacity-90" : "opacity-100"}`}
                    />
                  );
                })}
              </div>
              <p className="font-mono text-sm font-black tracking-widest mt-1.5">{waybill}</p>
            </div>

            {/* Ship To Section */}
            <div className="border-b-2 border-black pb-3 mb-3">
              <p className="text-[9px] font-sans font-black text-gray-500 uppercase">DELIVER TO (CONSIGNEE):</p>
              <p className="text-sm font-black font-sans text-black mt-0.5">{shipping.fullName}</p>
              <p className="text-xs font-sans text-gray-900 leading-snug mt-0.5">
                {shipping.address}, {shipping.city}
              </p>
              <p className="text-xs font-sans text-gray-900 font-bold">
                State: {shipping.state}, India
              </p>
              <div className="flex justify-between items-center mt-1 pt-1 border-t border-dashed border-gray-300 font-sans">
                <span className="text-xs font-bold font-mono">PIN: {shipping.postalCode}</span>
                <span className="text-xs font-bold font-mono">PH: {shipping.phone}</span>
              </div>
            </div>

            {/* Payment Mode Banner */}
            <div
              className={`p-2.5 rounded border-2 border-black mb-3 flex justify-between items-center font-sans ${
                isCOD ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider block">
                  {isCOD ? "CASH ON DELIVERY (COD)" : "PREPAID ORDER"}
                </span>
                <span className="text-[11px] font-semibold opacity-90">
                  {isCOD ? "Collect from customer" : "Do not collect cash"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-mono">
                  {isCOD ? `₹${order.totalPrice?.toFixed(2)}` : "₹0.00"}
                </span>
              </div>
            </div>

            {/* Package Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-sans border-b-2 border-black pb-2 mb-2">
              <div>
                <span className="text-gray-500 font-bold">Order #:</span>{" "}
                <span className="font-bold font-mono">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold">Weight:</span>{" "}
                <span className="font-bold">{tracking.weight || 0.5} KG</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold">Dimensions:</span>{" "}
                <span className="font-bold">
                  {tracking.dimensions?.length || 10}x{tracking.dimensions?.width || 10}x
                  {tracking.dimensions?.height || 10} CM
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-bold">Pieces:</span>{" "}
                <span className="font-bold">{order.orderItems?.length || 1} Item(s)</span>
              </div>
            </div>

            {/* Items Summary Table */}
            <div className="border-b border-black pb-2 mb-2 font-sans">
              <p className="text-[9px] font-black text-gray-500 uppercase mb-1">PACKAGE CONTENT:</p>
              <div className="space-y-1">
                {(order.orderItems || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[10px]">
                    <span className="truncate pr-2 font-medium">{item.name}</span>
                    <span className="font-bold whitespace-nowrap">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Address (Consignor) */}
            <div className="font-sans text-[9px] text-gray-600 leading-tight">
              <p className="font-black text-gray-800 uppercase">RETURN TO (CONSIGNOR):</p>
              <p>PlantPure Store, New Delhi, Delhi - 110001</p>
              <p>Support: 9810999976 • care@plantpure.in</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          {labelPdfUrl ? (
            <a
              href={labelPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3.5 py-2.5 rounded-xl transition-all"
            >
              <Download size={14} /> Official Delhivery PDF
            </a>
          ) : (
            <span className="text-xs text-slate-400">Direct Thermal Print Available</span>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 text-xs transition-all"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-200 text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer size={15} /> Print Shipping Label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingLabelModal;


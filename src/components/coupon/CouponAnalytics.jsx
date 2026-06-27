import React from "react";
import { Ticket, CheckCircle, XCircle, Banknote } from "lucide-react";

const CouponAnalytics = ({ analytics }) => {
  if (!analytics) return null;

  const cards = [
    { 
      title: "Total Coupons", 
      value: analytics.totalCoupons, 
      icon: <Ticket style={{ color: "var(--color-secondary)" }} />, 
      style: { backgroundColor: "rgba(10, 71, 46, 0.06)" } 
    },
    { 
      title: "Active Coupons", 
      value: analytics.activeCoupons, 
      icon: <CheckCircle style={{ color: "var(--color-primary)" }} />, 
      style: { backgroundColor: "rgba(84, 180, 53, 0.08)" } 
    },
    { 
      title: "Expired Coupons", 
      value: analytics.expiredCoupons, 
      icon: <XCircle className="text-red-600" />, 
      style: { backgroundColor: "#FEF2F2" } 
    },
    { 
      title: "Total Discount Given", 
      value: `₹
${analytics.totalDiscountGiven?.toFixed(2)}`, 
      icon: <Banknote style={{ color: "var(--color-primary)" }} />, 
      style: { backgroundColor: "rgba(84, 180, 53, 0.08)" } 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 rounded-lg" style={card.style}>{card.icon}</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-0.5">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CouponAnalytics;
import { api } from "./api.js";
import { toast } from "react-hot-toast";

// ─── 1. Update/Sync Privacy Policy (Admin Only) ──────────────────────────────
export const updatePrivacyPolicyApi = async (pageData) => {
  try {
    // Payload contains: { content, metaTitle, metaDescription, status }
    const { data } = await api.put("/legal/privacy-policy", pageData);
    toast.success(data.message || "Privacy Policy synced and published successfully! 🚀");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update Privacy Policy";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 2. Update/Sync Refund Policy (Admin Only) ───────────────────────────────
export const updateRefundPolicyApi = async (pageData) => {
  try {
    // Payload contains: { content, metaTitle, metaDescription, status }
    const { data } = await api.put("/legal/refund-policy", pageData);
    toast.success(data.message || "Refund Policy synced and updated cleanly.");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update Refund Policy";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 3. Update/Sync Terms & Conditions (Admin Only) ─────────────────────────
export const updateTermsConditionsApi = async (pageData) => {
  try {
    // Payload contains: { content, metaTitle, metaDescription, status }
    const { data } = await api.put("/legal/terms-conditions", pageData);
    toast.success(data.message || "Terms & Conditions updated successfully!");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update Terms & Conditions";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 4. Get Page Content (Public Storefront Fetch) ──────────────────────────
export const getPageContentApi = async (pageKey) => {
  try {
    const { data } = await api.get(`/legal/public/${pageKey}`);
    return data;
  } catch (error) {
    console.warn(`Initial fetch status for ${pageKey}: Setup record needed.`);
    return null;
  }
};
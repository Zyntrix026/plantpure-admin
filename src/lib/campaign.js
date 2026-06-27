import { api } from "./api.js";
import { toast } from "react-hot-toast";

// ─── 1. Get All Campaigns (paginated, without heavy emailContent/recipients) ──
export const getAllCampaigns = async ({ page = 1, limit = 20 } = {}) => {
  try {
    const { data } = await api.get("/campaigns", { params: { page, limit } });
    return data;
    // Response shape:
    // {
    //   success: true,
    //   total: 14,
    //   totalPages: 1,
    //   currentPage: 1,
    //   data: [
    //     {
    //       _id: "abc123",
    //       name: "Summer Sale",
    //       subject: "50% off this weekend!",
    //       status: "Sent",            // "Sent" | "Draft" | "Failed"
    //       recipientCount: 320,
    //       successCount: 318,
    //       failCount: 2,
    //       sentAt: "2025-06-10T14:00:00.000Z",
    //       createdAt: "2025-06-10T13:55:00.000Z",
    //       updatedAt: "2025-06-10T14:00:05.000Z"
    //     }, ...
    //   ]
    // }
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch campaigns";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 2. Get Single Campaign by ID (includes emailContent + recipients array) ──
export const getCampaignById = async (id) => {
  try {
    const { data } = await api.get(`/campaigns/${id}`);
    return data;
    // Response shape:
    // {
    //   success: true,
    //   data: {
    //     _id: "abc123",
    //     name: "Summer Sale",
    //     subject: "50% off this weekend!",
    //     emailContent: "<h2>Hello!</h2><p>...</p>",
    //     recipients: ["a@x.com", "b@y.com"],
    //     recipientCount: 2,
    //     status: "Sent",
    //     successCount: 2,
    //     failCount: 0,
    //     sentAt: "2025-06-10T14:00:00.000Z",
    //     createdAt: "...",
    //     updatedAt: "..."
    //   }
    // }
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch campaign";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 3. Get Campaign Stats (for dashboard cards) ──────────────────────────────
export const getCampaignStats = async () => {
  try {
    const { data } = await api.get("/campaigns/stats");
    return data;
    // Response shape:
    // {
    //   success: true,
    //   data: {
    //     totalCampaigns: 14,
    //     sentCampaigns: 10,
    //     draftCampaigns: 3,
    //     failedCampaigns: 1,
    //     totalEmailsSent: 45280
    //   }
    // }
  } catch (error) {
    // Silent — stats failure should not block the page
    console.error("Failed to fetch campaign stats:", error.message);
    return null;
  }
};

// ─── 4. Send Bulk Campaign ────────────────────────────────────────────────────
export const sendBulkCampaign = async ({ name, subject, emailContent, recipientsText }) => {
  // Request body shape:
  // {
  //   name: "Summer Sale",                       // required
  //   subject: "50% off this weekend!",           // required
  //   emailContent: "<h2>Hello!</h2>...",         // required — raw HTML from rich editor
  //   recipientsText: "a@x.com\nb@y.com\n..."    // required — newline/comma/semicolon separated
  // }
  try {
    const { data } = await api.post("/campaigns/send", {
      name,
      subject,
      emailContent,
      recipientsText,
    });
    toast.success(data.message);
    return data;
    // Response shape:
    // {
    //   success: true,
    //   message: "Campaign dispatched. 318 sent, 2 failed out of 320 recipients.",
    //   data: { _id, name, subject, status: "Sent", recipientCount, successCount, failCount, sentAt, ... }
    // }
  } catch (error) {
    const message = error.response?.data?.message || "Failed to send campaign";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 5. Save Campaign as Draft ────────────────────────────────────────────────
export const saveCampaignDraft = async ({ name, subject = "", emailContent = "", recipientsText = "" }) => {
  // Request body shape:
  // {
  //   name: "Winter Promo",            // required
  //   subject: "Big savings inside!",  // optional for draft
  //   emailContent: "<p>...</p>",      // optional for draft
  //   recipientsText: "a@x.com\n..."   // optional for draft
  // }
  try {
    const { data } = await api.post("/campaigns/draft", {
      name,
      subject,
      emailContent,
      recipientsText,
    });
    toast.success(data.message || "Draft saved successfully.");
    return data;
    // Response shape:
    // {
    //   success: true,
    //   message: "Draft saved successfully.",
    //   data: { _id, name, subject, status: "Draft", recipientCount, createdAt, ... }
    // }
  } catch (error) {
    const message = error.response?.data?.message || "Failed to save draft";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 6. Update Existing Draft ─────────────────────────────────────────────────
export const updateCampaignDraft = async (id, { name, subject, emailContent, recipientsText }) => {
  // Request body shape: same optional fields as saveCampaignDraft
  // Note: cannot update a campaign with status "Sent"
  try {
    const { data } = await api.patch(`/campaigns/${id}`, {
      name,
      subject,
      emailContent,
      recipientsText,
    });
    toast.success(data.message || "Campaign updated.");
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update campaign";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 7. Send Test Email ───────────────────────────────────────────────────────
export const sendTestEmail = async ({ subject, emailContent, testEmail }) => {
  // Request body shape:
  // {
  //   subject: "50% off this weekend!",    // required
  //   emailContent: "<h2>Hello!</h2>...",  // required
  //   testEmail: "admin@example.com"       // required — single valid email
  // }
  // Note: subject in inbox will be prefixed with [TEST]
  try {
    const { data } = await api.post("/campaigns/test", {
      subject,
      emailContent,
      testEmail,
    });
    toast.success(data.message || `Test email sent to ${testEmail}.`);
    return data;
    // Response shape:
    // { success: true, message: "Test email sent to admin@example.com." }
  } catch (error) {
    const message = error.response?.data?.message || "Failed to send test email";
    toast.error(message);
    throw new Error(message);
  }
};

// ─── 8. Delete Campaign ───────────────────────────────────────────────────────
export const deleteCampaign = async (id) => {
  try {
    const { data } = await api.delete(`/campaigns/${id}`);
    toast.success(data.message || "Campaign deleted successfully.");
    return data;
    // Response shape:
    // { success: true, message: "Campaign deleted successfully." }
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete campaign";
    toast.error(message);
    throw new Error(message);
  }
};

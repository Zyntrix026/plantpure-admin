import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  FiSend,
  FiUsers,
  FiMail,
  FiCheckCircle,
  FiEdit3,
  FiAlertCircle,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import toast from "react-hot-toast";
import JodEditor from "../components/editor/JodEditor";
import CampaignStats from "../components/E-mail campaign/CampaignStats";
import CampaignTable from "../components/E-mail campaign/CampaignTable";
import {
  getAllCampaigns,
  getCampaignStats,
  sendBulkCampaign,
  saveCampaignDraft,
  sendTestEmail,
  deleteCampaign,
} from "../lib/campaign.js";

const DEFAULT_CONTENT = `<h2>Hello from PlantPure!</h2>
<p>We have an exciting update for you.</p>
<p>Visit our website today and explore our latest range.</p>`;

export default function EmailCampaigns() {
  // Tracker to verify if we are editing an existing draft campaign
  const [activeCampaignId, setActiveCampaignId] = useState(null);
  
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [recipientsText, setRecipientsText] = useState("");
  const [emailContent, setEmailContent] = useState(DEFAULT_CONTENT);
  const [testEmailAddr, setTestEmailAddr] = useState("");
  const [showTestInput, setShowTestInput] = useState(false);

  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  const recipientCount = useMemo(() => {
    if (!recipientsText.trim()) return 0;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return [
      ...new Set(
        recipientsText
          .split(/[\n,;]+/)
          .map((e) => e.trim().toLowerCase())
          .filter((e) => EMAIL_REGEX.test(e)),
      ),
    ].length;
  }, [recipientsText]);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await getAllCampaigns();
      setCampaigns(res.data || []);
    } catch {
      // toast already shown inside lib
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await getCampaignStats();
    if (res?.data) setStats(res.data);
  }, []);

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, [fetchCampaigns, fetchStats]);

  const resetForm = () => {
    setActiveCampaignId(null);
    setCampaignName("");
    setSubject("");
    setRecipientsText("");
    setEmailContent(DEFAULT_CONTENT);
    setTestEmailAddr("");
    setShowTestInput(false);
  };

  const handleEditSelect = (campaign) => {
    setActiveCampaignId(campaign._id || campaign.id);
    setCampaignName(campaign.name || "");
    setSubject(campaign.subject || "");
    setRecipientsText(campaign.recipientsText || campaign.recipients || "");
    setEmailContent(campaign.emailContent || campaign.content || DEFAULT_CONTENT);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success(`Loaded settings for: ${campaign.name}`);
  };

  const handleSend = async () => {
    if (
      !campaignName.trim() ||
      !subject.trim() ||
      !emailContent.trim() ||
      !recipientsText.trim()
    ) {
      toast.error("Please fill in all fields before sending.");
      return;
    }
    if (recipientCount === 0) {
      toast.error("No valid email addresses detected in recipients.");
      return;
    }

    const confirmed = window.confirm(
      `You are about to send this campaign to ${recipientCount} recipients. Continue?`,
    );
    if (!confirmed) return;

    try {
      setSending(true);
      await sendBulkCampaign({
        id: activeCampaignId, // Pass ID if updating an existing draft campaign
        name: campaignName,
        subject,
        emailContent,
        recipientsText,
      });
      resetForm();
      fetchCampaigns();
      fetchStats();
    } catch {
      // toast already shown inside lib
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!campaignName.trim()) {
      toast.error("Campaign name is required to save a draft.");
      return;
    }
    try {
      setSavingDraft(true);
      await saveCampaignDraft({
        id: activeCampaignId, // Sync over structural document mutations
        name: campaignName,
        subject,
        emailContent,
        recipientsText,
      });
      fetchCampaigns();
    } catch {
      // toast already shown inside lib
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmailAddr.trim()) {
      toast.error("Enter a test email address.");
      return;
    }
    if (!subject.trim() || !emailContent.trim()) {
      toast.error("Subject and email content are required to send a test.");
      return;
    }
    try {
      setSendingTest(true);
      await sendTestEmail({ subject, emailContent, testEmail: testEmailAddr });
      setShowTestInput(false);
      setTestEmailAddr("");
    } catch {
      // toast already shown inside lib
    } finally {
      setSendingTest(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign? This cannot be undone.")) return;
    try {
      await deleteCampaign(id);
      if (activeCampaignId === id) resetForm();
      fetchCampaigns();
      fetchStats();
    } catch {
      // toast already shown inside lib
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 ">
      {/* Page Title Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Email Campaigns
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create, manage, and dispatch email campaigns to your audience.
          </p>
        </div>
        {activeCampaignId && (
          <button
            onClick={resetForm}
            className="self-start sm:self-center py-2 px-4 text-xs font-semibold rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 transition flex items-center gap-1.5 shadow-sm border border-indigo-200/50 dark:border-indigo-800/50"
          >
            <FiPlus className="w-4 h-4" />
            Clear & Create New
          </button>
        )}
      </div>

      {/* Analytics Counter Dashboard Component */}
      <CampaignStats stats={stats} />

      <div className="space-y-6 mb-8 max-w-none">
        {/* Campaign Structure Metadata Form Block */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <FiEdit3 className="h-5 w-5 text-indigo-500" />
            Campaign Details {activeCampaignId && <span className="text-xs font-normal text-amber-500 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">(Editing Draft)</span>}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Campaign Name *
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="e.g., Summer End Clearance Promo"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Subject Line *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="e.g., 🔥 Quick! 40% Off inside..."
              />
            </div>
          </div>
        </div>

        {/* Target Audience / Recipient Parsing Block */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiUsers className="h-5 w-5 text-indigo-500" />
              Recipients
            </h2>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
              {recipientCount} Valid Emails
            </span>
          </div>
          <label className="block mb-2 text-sm text-gray-500 dark:text-gray-400">
            One email per line — or separate with commas/semicolons
          </label>
          <textarea
            rows={5}
            value={recipientsText}
            onChange={(e) => setRecipientsText(e.target.value)}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
            placeholder={`user1@example.com\nuser2@example.com`}
          />
          {recipientsText.trim() && recipientCount === 0 && (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <FiAlertCircle className="w-3.5 h-3.5" />
              No valid email addresses detected — check formatting.
            </p>
          )}
        </div>

        {/* Email Visual WYSIWYG Editor Body */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <FiMail className="h-5 w-5 text-indigo-500" />
            Email Body Content *
          </h2>
          <JodEditor value={emailContent} onChange={setEmailContent} />
        </div>

        {/* Test Email Dynamic Input Panel */}
        {showTestInput && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center animate-in fade-in duration-200">
            <input
              type="email"
              value={testEmailAddr}
              onChange={(e) => setTestEmailAddr(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
            />
            <button
              onClick={handleSendTest}
              disabled={sendingTest}
              className="text-sm font-medium px-4 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-60 transition whitespace-nowrap"
            >
              {sendingTest ? "Sending..." : "Send Test"}
            </button>
            <button
              onClick={() => {
                setShowTestInput(false);
                setTestEmailAddr("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Operational Footer Action Controls */}
        <div className="flex flex-wrap items-center gap-4 justify-end pt-2">
          <button
            onClick={handleSaveDraft}
            disabled={savingDraft}
            className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-60 transition flex items-center gap-2 shadow-sm"
          >
            <FiFileText className="h-4 w-4 text-gray-500" />
            {savingDraft ? "Saving..." : activeCampaignId ? "Update Draft" : "Save Draft"}
          </button>

          <button
            onClick={() => setShowTestInput((v) => !v)}
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition gap-2 shadow-sm"
          >
            <FiCheckCircle className="h-4 w-4 text-emerald-500" />
            Send Test Email
          </button>

          <button
            onClick={handleSend}
            disabled={sending}
            className="text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center transition gap-2 shadow-sm"
          >
            <FiSend className="h-4 w-4" />
            {sending ? `Sending to ${recipientCount}...` : "Send Campaign"}
          </button>
        </div>
      </div>

      {/* Main Historical Campaigns Data Table */}
      <CampaignTable
        campaigns={campaigns}
        loading={loadingList}
        onDelete={handleDelete}
        onEdit={handleEditSelect} 
      />
    </div>
  );
}
import React from 'react';
import { FiTrash2, FiLoader } from 'react-icons/fi';

const STATUS_STYLES = {
  Sent:   'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Draft:  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  Failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function CampaignTable({ campaigns, loading, onDelete }) {
  if (loading) {
    return (
      <div className="p-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400">
        <FiLoader className="animate-spin h-5 w-5" />
        <span className="text-sm">Loading campaigns...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Campaign Logs</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{campaigns.length} total</span>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No campaigns yet. Create your first campaign above.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Campaign Name</th>
                <th className="px-6 py-3">Subject Line</th>
                <th className="px-6 py-3">Recipients</th>
                <th className="px-6 py-3">Sent / Failed</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr
                  key={c._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">{c.subject}</td>
                  <td className="px-6 py-4 font-mono">{(c.recipientCount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {c.status === 'Sent' ? (
                      <span>
                        <span className="text-green-600 font-semibold">{c.successCount ?? c.recipientCount}</span>
                        {c.failCount > 0 && (
                          <span className="text-red-500 ml-1">/ {c.failCount} failed</span>
                        )}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[c.status] || ''}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {c.sentAt
                      ? new Date(c.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    }
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(c._id)}
                      className="font-medium text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

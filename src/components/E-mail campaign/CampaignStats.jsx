import React from 'react';
import { FiLayers, FiSend, FiEdit3, FiAlertCircle } from 'react-icons/fi';

export default function CampaignStats({ stats }) {
  const cards = [
    {
      label: 'Total Campaigns',
      value: stats ? stats.totalCampaigns : '—',
      icon: FiLayers,
      colorClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      label: 'Emails Sent',
      value: stats ? stats.totalEmailsSent.toLocaleString() : '—',
      icon: FiSend,
      colorClass: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      label: 'Drafts',
      value: stats ? stats.draftCampaigns : '—',
      icon: FiEdit3,
      colorClass: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      label: 'Failed',
      value: stats ? stats.failedCampaigns : '—',
      icon: FiAlertCircle,
      colorClass: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center space-x-4"
          >
            <div className={`p-3 rounded-lg ${stat.colorClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

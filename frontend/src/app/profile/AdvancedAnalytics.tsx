"use client";
import { useEffect, useState } from "react";
import { fetchAdvancedAnalytics } from "../../lib/profileApi";

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchAdvancedAnalytics().then(setAnalytics);
  }, []);

  if (!analytics) return null;

  return (
    <div className="my-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Advanced Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{analytics.views}</div>
          <div className="text-xs sm:text-sm text-gray-500">Total Views</div>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">{analytics.shares}</div>
          <div className="text-xs sm:text-sm text-gray-500">Shares</div>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{analytics.avgReadTime} min</div>
          <div className="text-xs sm:text-sm text-gray-500">Avg. Read Time</div>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow p-4 text-center">
          <div className="text-base sm:text-lg font-bold text-primary">{analytics.topArticle}</div>
          <div className="text-xs sm:text-sm text-gray-500">Top Article</div>
        </div>
      </div>
    </div>
  );
}

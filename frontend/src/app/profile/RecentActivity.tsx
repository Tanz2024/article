"use client";
import { useEffect, useState } from "react";
import { fetchRecentActivity } from "../../lib/profileApi";

export default function RecentActivity() {
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentActivity().then(setActivity);
  }, []);

  if (!activity.length) return null;

  return (
    <div className="my-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Recent Activity</h2>
      <ul className="space-y-2">
        {activity.map(a => (
          <li key={a.id} className="rounded-lg px-3 sm:px-4 py-2 sm:py-3 shadow bg-gray-50 dark:bg-gray-800 border-l-4 border-primary">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
              <span className="text-xs sm:text-sm font-medium">{a.action} <span className="text-primary">{a.title}</span></span>
              <span className="text-xs text-gray-400 ml-0 sm:ml-4">{a.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

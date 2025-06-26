"use client";
import { useState, useEffect } from "react";
import RequireAuth from "../../components/RequireAuth";
import Analytics from "./Analytics";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import ThemeToggle from "../../components/ThemeToggle";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <RequireAuth>
      <main className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <div className="flex gap-2 items-center">
            <LanguageSwitcher value={"en"} onChange={() => {}} />
            <ThemeToggle />
          </div>
        </div>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">Manage your articles, view analytics, and track your progress.</p>
        {user?.id && <Analytics userId={user.id} />}
        {/* Add production-level perks and milestones here */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Milestones & Perks</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl shadow flex flex-col items-center">
              <span className="text-3xl mb-2">🏆</span>
              <span className="font-semibold text-lg">First Article Published</span>
              <span className="text-sm text-gray-500 mt-1">Keep writing to unlock more!</span>
            </li>
            <li className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl shadow flex flex-col items-center">
              <span className="text-3xl mb-2">⭐</span>
              <span className="font-semibold text-lg">100 Points Earned</span>
              <span className="text-sm text-gray-500 mt-1">Engage more to earn badges.</span>
            </li>
            {/* Add more perks/milestones as needed */}
          </ul>
        </div>
      </main>
    </RequireAuth>
  );
}

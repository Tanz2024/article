"use client";
import { useEffect, useState } from "react";

export default function UserStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();        setStats({
          articles: data.articles?.length || 0,
          bookmarks: data.bookmarks?.length || 0,
          likes: data.likes?.length || 0,
          points: (data.articles?.length || 0) * 10 + (data.likes?.length || 0) * 2,
          views: data.articles?.reduce((sum: number, article: any) => sum + (article.views || 0), 0) || 0,
          shares: data.articles?.reduce((sum: number, article: any) => sum + (article.shares || 0), 0) || 0,
          comments: data.articles?.reduce((sum: number, article: any) => sum + (article.comments?.length || 0), 0) || 0,
          avgRating: data.articles?.length ? (data.articles.reduce((sum: number, article: any) => sum + (article.rating || 0), 0) / data.articles.length).toFixed(1) : "0.0",
        });
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div className="py-4 text-center text-gray-400">Loading stats...</div>;
  if (!stats) return null;
  return (
    <div className="my-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
        <span className="text-primary">📊</span>
        Your Statistics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl shadow-lg p-6 text-center border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl sm:text-4xl mb-2">📝</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.articles}</div>
          <div className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Articles Published</div>
          <div className="text-xs text-gray-500 mt-1">Keep writing!</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl shadow-lg p-6 text-center border border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl sm:text-4xl mb-2">🔖</div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.bookmarks}</div>
          <div className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Bookmarks</div>
          <div className="text-xs text-gray-500 mt-1">Saved articles</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl shadow-lg p-6 text-center border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl sm:text-4xl mb-2">❤️</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{stats.likes}</div>
          <div className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Likes Received</div>
          <div className="text-xs text-gray-500 mt-1">Community love</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl shadow-lg p-6 text-center border border-yellow-200 dark:border-yellow-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="text-3xl sm:text-4xl mb-2">⭐</div>
          <div className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.points}</div>
          <div className="text-xs sm:text-sm font-medium text-yellow-600 dark:text-yellow-400">Total Points</div>
          <div className="text-xs text-gray-500 mt-1">Points from activity</div>
        </div>
      </div>
    </div>
  );
}

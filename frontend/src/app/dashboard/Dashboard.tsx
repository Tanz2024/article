"use client";
import { useEffect, useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { fetchBadges, fetchNotifications, fetchProfile, fetchRecentActivity, fetchUserAnalytics } from "@/lib/profileApi";
import { FaMedal, FaStar, FaTrophy, FaCrown, FaAward, FaGem, FaRocket, FaFire, FaHeart, FaBook, FaUserGraduate, FaPen, FaChartLine, FaUpload, FaShare, FaCog, FaBell } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const badgeIconMap: Record<string, any> = {
  FaMedal, FaStar, FaTrophy, FaCrown, FaAward, FaGem, FaRocket, FaFire, FaHeart, FaBook, FaUserGraduate
};
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  const { user, stats } = useProfile();
  const [badges, setBadges] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setBadges(await fetchBadges());
      setNotifications(await fetchNotifications());
      setActivity(await fetchRecentActivity());
      // Fetch real analytics data for chart
      const analytics = await fetchUserAnalytics();
      if (analytics && analytics.months) {
        setChartData({
          categories: analytics.months,
          series: [
            { name: 'Views', data: analytics.views },
            { name: 'Likes', data: analytics.likes },
            { name: 'Comments', data: analytics.comments }
          ]
        });
      } else {
        setChartData(null);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="py-8 text-center text-gray-400">Loading dashboard...</div>;

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen w-full">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
        {/* Profile Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-8 hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar && user.avatar.startsWith('/api/users/uploads/avatars/') ? `http://localhost:5000${user.avatar}` : user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0ea5e9&color=ffffff&size=120`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
          />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
              {user?.name || 'User'}
              <span className="flex items-center gap-1">
                {badges.filter(b => b.earned).map(badge => {
                  const Icon = badgeIconMap[badge.icon] || FaAward;
                  return (
                    <span key={badge.id} className="relative group">
                      <Icon className="text-yellow-500 text-xl sm:text-2xl ml-1 drop-shadow" />
                      <span className="absolute left-1/2 -translate-x-1/2 mt-2 z-10 hidden group-hover:flex px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap shadow-lg transition-all duration-150 opacity-90">
                        {badge.label}
                      </span>
                    </span>
                  );
                })}
              </span>
            </h1>
            <div className="flex flex-wrap gap-3 mt-2 justify-center sm:justify-start">
              <span className="bg-gradient-to-r from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700 px-4 py-1 rounded-full font-semibold text-xs sm:text-sm text-blue-700 dark:text-blue-200 shadow">
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member'}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm shadow transition-all duration-200"
            onClick={() => router.push("/articles/new")}
          >
            <FaPen /> Write Article
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold text-sm shadow transition-all duration-200"
            onClick={() => router.push("/upload")}
          >
            <FaUpload /> Upload Content
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold text-sm shadow transition-all duration-200"
            onClick={() => router.push(`/profile/${user?.username || "me"}`)}
          >
            <FaShare /> Share Profile
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-semibold text-sm shadow transition-all duration-200"
            onClick={() => router.push("/dashboard/analytics")}
          >
            <FaChartLine /> Analytics
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm shadow transition-all duration-200"
            onClick={() => router.push("/settings")}
          >
            <FaCog /> Settings
          </button>
        </div>

        {/* Analytics & Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow p-6 text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.articles || 0}</div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">Articles</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow p-6 text-center">
            <div className="text-3xl mb-2">❤️</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.followers || 0}</div>
            <div className="text-xs font-medium text-green-600 dark:text-green-400">Followers</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow p-6 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.views || 0}</div>
            <div className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Profile Views</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow p-6 text-center">
            <div className="text-3xl mb-2">🔖</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats?.friends || 0}</div>
            <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Friends</div>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <FaChartLine className="text-purple-500" /> Analytics Overview
          </h2>
          {chartData && Chart ? (
            <Chart
              options={{
                chart: { id: 'analytics', toolbar: { show: false } },
                xaxis: { categories: chartData.categories },
                colors: ['#0ea5e9', '#f59e42', '#4ade80'],
                dataLabels: { enabled: false },
                legend: { position: 'top' },
                grid: { show: false },
              }}
              series={chartData.series}
              type="line"
              height={260}
            />
          ) : (
            <div className="text-gray-400">No analytics data yet.</div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-red-700 dark:text-red-300">
            <FaFire className="text-red-500" /> Recent Activity
          </h2>
          {activity.length === 0 ? (
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg shadow p-4 text-gray-400">No recent activity yet.</div>
          ) : (
            <ul className="space-y-2">
              {activity.map((a: any, i: number) => (
                <li key={i} className="rounded-lg px-4 py-3 shadow bg-gray-50 dark:bg-gray-900 border-l-4 border-primary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0 transition-all hover:scale-[1.01]">
                  <span className="text-xs sm:text-sm font-medium">{a.action} <span className="text-primary">{a.title}</span></span>
                  <span className="text-xs text-gray-400 ml-0 sm:ml-4">{a.date ? new Date(a.date).toLocaleString() : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notifications */}
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <FaBell className="text-blue-500" /> Notifications
          </h2>
          <ul className="space-y-2">
            {notifications.length === 0 && <li className="text-gray-400">No notifications yet.</li>}
            {notifications.map((n: any) => (
              <li key={n.id} className={`rounded-lg px-4 py-3 shadow bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0 transition-all hover:scale-[1.01]`}>
                <span className="text-xs sm:text-sm font-medium">{n.message}</span>
                <span className="text-xs text-gray-400 ml-0 sm:ml-4">{n.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import UserStats from "./UserStats";
import Notifications from "./Notifications";
import Badges from "./Badges";
import RecentActivity from "./RecentActivity";
import AdvancedAnalytics from "./AdvancedAnalytics";
import MyArticles from "../dashboard/MyArticles";
import Analytics from "../dashboard/Analytics";
import ProfileSettings from "../dashboard/ProfileSettings";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    }
  }, []);

  if (!user) {
    return <main className="p-8 max-w-2xl mx-auto"><h1 className="text-2xl font-bold mb-4">My Profile</h1><p>Loading...</p></main>;
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">My Profile</h1>
      <div className="flex items-center gap-6 mb-8">
        {user.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full border-2 border-primary shadow" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/80 flex items-center justify-center text-white font-bold text-4xl">
            {(user.username || user.email)?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="text-2xl font-semibold">{user.username || user.email}</div>
          <div className="text-gray-500">{user.email}</div>
          <div className="text-xs text-gray-400 mt-1">Role: {user.role}</div>
        </div>
      </div>
      <UserStats />
      <Notifications />
      <Badges />
      <RecentActivity />
      <AdvancedAnalytics />
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">My Articles</h2>
        <MyArticles userId={user.id} />
      </div>
      <div className="my-8">
        <Analytics userId={user.id} />
      </div>
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Account Information & Profile Settings</h2>
        <ProfileSettings />
      </div>
      <div className="grid gap-2 mt-8">
        <div><span className="font-semibold">Bio:</span> {user.bio || <span className="text-gray-400">No bio set.</span>}</div>
        <div><span className="font-semibold">Birthday:</span> {user.birthday || <span className="text-gray-400">Not set.</span>}</div>
        <div><span className="font-semibold">Joined:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</div>
      </div>
    </main>
  );
}

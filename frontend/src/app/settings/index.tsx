"use client";
import { useEffect, useState } from "react";
import ProfileSettings from "../dashboard/ProfileSettings";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    }
  }, []);

  if (!user) {
    return <main className="p-8 max-w-2xl mx-auto"><h1 className="text-2xl font-bold mb-4">Settings</h1><p>Loading...</p></main>;
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">Settings</h1>
      <ProfileSettings />
    </main>
  );
}

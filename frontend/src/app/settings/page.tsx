"use client";
import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen w-full">
      <main className="max-w-2xl mx-auto px-2 sm:px-4 py-8">
        <div className="flex justify-end mb-4">
          <Link href="/profile">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 text-sm sm:text-base">
              Back to Profile
            </button>
          </Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-900 dark:text-white">Settings</h1>

        {/* Account Security */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Account Security</h2>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow transition-all duration-200 mb-3 text-sm">
            Change Password
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
            <span className="text-xs text-gray-400">(Coming soon)</span>
          </div>
          <div className="text-xs text-gray-400">Recent login activity and device management coming soon.</div>
        </section>

        {/* Preferences */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Preferences</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Theme</label>
            <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <input value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400" />
          </div>
        </section>

        {/* Connected Accounts */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Connected Accounts</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 text-gray-700 dark:text-gray-200 font-semibold border border-gray-300 dark:border-gray-600 shadow hover:from-gray-200 hover:to-gray-400 dark:hover:from-gray-800 dark:hover:to-gray-950 transition-all">Connect Google (Coming soon)</button>
            <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900 text-gray-700 dark:text-gray-200 font-semibold border border-gray-300 dark:border-gray-600 shadow hover:from-gray-200 hover:to-gray-400 dark:hover:from-gray-800 dark:hover:to-gray-950 transition-all">Connect GitHub (Coming soon)</button>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Data & Privacy</h2>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 text-gray-700 dark:text-gray-200 font-semibold mb-3 shadow hover:from-gray-300 hover:to-gray-500 dark:hover:from-gray-800 dark:hover:to-gray-950 transition-all text-sm">
            Download My Data
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold shadow transition-all duration-200 text-sm">
            Delete Account
          </button>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Notification Preferences</h2>
          <div className="flex items-center gap-3 mb-2">
            <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} className="accent-blue-600 w-4 h-4" />
            <span className="text-sm">Email Notifications</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={pushNotif} onChange={e => setPushNotif(e.target.checked)} className="accent-blue-600 w-4 h-4" />
            <span className="text-sm">Push Notifications</span>
          </div>
        </section>

        {/* Support */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Support</h2>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-400 dark:from-blue-900 dark:to-blue-700 text-blue-700 dark:text-blue-200 font-semibold mb-2 shadow hover:from-blue-200 hover:to-blue-500 dark:hover:from-blue-800 dark:hover:to-blue-900 transition-all text-sm">
            Contact Support
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-400 dark:from-gray-700 dark:to-gray-900 text-gray-700 dark:text-gray-200 font-semibold shadow hover:from-gray-200 hover:to-gray-500 dark:hover:from-gray-800 dark:hover:to-gray-950 transition-all text-sm">
            Report a Problem
          </button>
        </section>
      </main>
    </div>
  );
}

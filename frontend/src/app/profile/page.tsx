"use client";
import { ProfileProvider, useProfile } from "@/contexts/ProfileContext";
import GlobalNotification from "@/components/GlobalNotification";
import ProfileHeader from "./ProfileHeader";
import PersonalDetails from "./PersonalDetails";
import SkillsInterests from "./SkillsInterests";
import SocialConnections from "./SocialConnections";
import MyArticles from "../dashboard/MyArticles";
import Analytics from "../dashboard/Analytics";

function ProfileContent() {
  const { user, loading } = useProfile();
  
  if (!user || loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto p-8">
          <div className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 p-8 mb-8">
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-48"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-32"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileHeader />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Primary Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
              </div>
              <div className="p-6">
                <PersonalDetails />
              </div>
            </section>

            {/* My Articles */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Articles</h2>
              </div>
              <div className="p-6">
                <MyArticles />
              </div>
            </section>

            {/* Analytics */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h2>
              </div>
              <div className="p-6">
                <Analytics userId={user.id?.toString()} />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Skills & Interests */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Interests</h2>
              </div>
              <div className="p-6">
                <SkillsInterests />
              </div>
            </section>

            {/* Social Connections */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Connections</h2>
              </div>
              <div className="p-6">
                <SocialConnections />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <ProfileProvider>
      <ProfileContent />
      <GlobalNotification />
    </ProfileProvider>
  );
}

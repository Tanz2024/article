"use client";
import Link from "next/link";
import { useProfile } from "@/contexts/ProfileContext";
import { useEffect, useState } from "react";
import { fetchBadges } from "@/lib/profileApi";
import { FaMedal, FaStar, FaTrophy, FaCrown, FaAward, FaGem } from "react-icons/fa";

export default function ProfileHeader() {
  const { user, stats } = useProfile();
  const [badges, setBadges] = useState<any[]>([]);

  // Map badge icon string to actual icon component
  const badgeIconMap: Record<string, any> = {
    FaMedal,
    FaStar,
    FaTrophy,
    FaCrown,
    FaAward,
    FaGem
  };

  useEffect(() => {
    fetchBadges().then(setBadges);
  }, []);

  if (!user) return null;

  // Helper function to get display name
  const getDisplayName = () => {
    if (user.name && user.name.trim() && user.name !== 'Not set') {
      return user.name;
    }
    
    // Construct from parts
    const parts = [];
    if (user.firstName) parts.push(user.firstName);
    if (user.middleName) parts.push(user.middleName); // include middle name
    if (user.lastName) parts.push(user.lastName);
    
    if (parts.length > 0) {
      return parts.join(' ');
    }
    
    return user.username || user.email?.split('@')[0] || 'User';
  };

  // Helper function to get initials for avatar
  const getDisplayInitials = () => {
    const name = getDisplayName();
    const nameParts = name.split(' ').filter(part => part.length > 0);
    
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Helper function to get the correct avatar URL (handles local uploads)
  const getAvatarUrl = () => {
    if (user.avatar) {
      if (user.avatar.startsWith('/api/users/uploads/avatars/')) {
        // Prepend backend base URL for local avatars
        return `http://localhost:5000${user.avatar}`;
      }
      return user.avatar;
    }
    const displayName = getDisplayName();
    const safeName = displayName && displayName !== 'Not set' ? displayName : 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=0ea5e9&color=ffffff&size=120`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Mobile Navigation */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white md:hidden">Profile</h2>
        <Link href="/dashboard">
          <button className="px-4 py-2 sm:px-6 sm:py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-xs sm:text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-lg">
            <span className="hidden sm:inline">Go to Dashboard →</span>
            <span className="sm:hidden">Dashboard</span>
          </button>
        </Link>
      </div>

      {/* Mobile-First Profile Header */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:flex-row lg:items-start gap-6 lg:gap-8">
          {/* Profile Photo - Centered on mobile */}
          <div className="relative shrink-0">
            <img
              src={getAvatarUrl()}
              alt="Profile photo"
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full object-cover border-3 border-gray-200 dark:border-gray-700 shadow-lg"
            />
          </div>
          
          {/* Profile Info - Mobile optimized */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight font-serif leading-tight flex items-center gap-2">
              {getDisplayName()}
              {/* Show earned badges as icons with tooltips */}
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
            
            {/* Meta info - Stack on mobile, flow on larger screens */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-start gap-2 sm:gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium text-xs sm:text-sm">
                {user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Member'}
              </span>
              {user.username && (
                <span className="flex items-center gap-1 text-xs sm:text-sm">
                  <span>@</span>
                  <span className="truncate max-w-32 sm:max-w-none">{user.username}</span>
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1 text-xs sm:text-sm">
                  <span>📍</span>
                  <span className="truncate max-w-32 sm:max-w-none">{user.location}</span>
                </span>
              )}
              <span className="text-xs sm:text-sm">
                Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'June 2025'}
              </span>
            </div>

            {/* Bio - Better mobile spacing */}
            {user.bio && (
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-6 max-w-full lg:max-w-2xl font-light">
                {user.bio}
              </p>
            )}

            {/* Stats - Mobile grid layout */}
            <div className="grid grid-cols-2 sm:flex sm:gap-6 lg:gap-8 gap-4 text-sm font-medium">
              <div className="text-center sm:text-left">
                <div className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">{stats?.articles || 0}</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">articles</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">{stats?.followers || 0}</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">followers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">{stats?.following || 0}</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">following</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">{stats?.views || 0}</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">views</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

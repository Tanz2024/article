"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { FaUsers, FaUserPlus, FaUserMinus, FaUserFriends, FaCheck, FaBell } from "react-icons/fa";
import { useProfile } from "@/contexts/ProfileContext";

interface User {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
  isFollowingMe?: boolean;
  isFriend?: boolean;
}

export default function SocialConnections() {
  const { updateStats, showNotification } = useProfile();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'suggested' | 'friends'>('suggested');
  useEffect(() => {
    fetchSocialData();  }, []);

  const fetchSocialData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch only suggested users and friends
      const [suggestedRes, friendsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/suggested-connections`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => ({ ok: false, error: err.message })),
        fetch(`${API_BASE_URL}/users/friends`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => ({ ok: false, error: err.message }))
      ]);

      if (suggestedRes.ok && 'headers' in suggestedRes && typeof suggestedRes.headers?.get === 'function') {
        const contentType = suggestedRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const suggestedData = await suggestedRes.json();
          setSuggestedUsers(suggestedData);
        } else {
          console.error('Suggested connections response is not JSON');
        }
      } else {
        console.error('Failed to fetch suggested connections');
      }
      
      if (friendsRes.ok && 'headers' in friendsRes && typeof friendsRes.headers?.get === 'function') {
        const contentType = friendsRes.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const friendsData = await friendsRes.json();
          setFriends(friendsData);
        } else {
          console.error('Friends response is not JSON');
        }
      } else {
        console.error('Failed to fetch friends');
      }
    } catch (error) {
      console.error("Failed to fetch social data:", error);
      showNotification("Failed to load social connections", "error");
    }
    setLoading(false);
  };
  const handleFollow = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update UI optimistically
        setSuggestedUsers(suggestedUsers.map(user => 
          user.id === userId ? { ...user, isFollowing: true } : user
        ));
        
        // Show notification based on whether they became friends
        if (result.becameFriends) {
          showNotification(`🎉 You and ${result.userName} are now friends!`, "success");
          // Refresh data to update friends list
          fetchSocialData();
        } else {
          showNotification(`✅ Successfully followed ${result.userName}`, "success");
        }
        
        // Refresh data to get updated counts
        setTimeout(() => fetchSocialData(), 500);
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
      showNotification("Failed to follow user", "error");
    }
  };
  const handleUnfollow = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/${userId}/unfollow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update UI optimistically
        setSuggestedUsers(suggestedUsers.map(user => 
          user.id === userId ? { ...user, isFollowing: false } : user
        ));
        
        // Remove from friends if they were friends
        if (result.wasUnfriended) {
          setFriends(friends.filter(user => user.id !== userId));
          showNotification(`💔 You and ${result.userName} are no longer friends`, "info");
        } else {
          showNotification(`➖ Unfollowed ${result.userName}`, "info");
        }
        
        // Refresh data to get updated counts
        setTimeout(() => fetchSocialData(), 500);
      }
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      showNotification("Failed to unfollow user", "error");
    }
  };

  const viewProfile = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      // Record the profile view
      await fetch(`${API_BASE_URL}/users/${userId}/view`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      // Open profile in new tab
      window.open(`/user/${userId}`, '_blank');
    } catch (error) {
      console.error("Failed to record profile view:", error);
      // Still open the profile even if view recording fails
      window.open(`/user/${userId}`, '_blank');
    }  };

  const getUserAvatar = (user: User) => {
    return user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=ffffff&size=40`;
  };  const renderUserCard = (user: User, showFollowButton = true, cardType: 'suggested' | 'friend' = 'suggested') => {
    const isFriend = user.isFriend || cardType === 'friend';
    const isFollowing = user.isFollowing || isFriend;
    
    return (
      <div key={user.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-750 rounded-xl hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={getUserAvatar(user)}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity border-2 border-white dark:border-slate-600 shadow-sm"
              onClick={() => viewProfile(user.id)}
            />
            {/* Status indicator */}
            {isFriend ? (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                <FaCheck className="text-white text-xs" />
              </div>
            ) : isFollowing ? (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                <FaCheck className="text-white text-xs" />
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm cursor-pointer text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2" onClick={() => viewProfile(user.id)}>
              {user.name}
              {isFriend && (
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  FRIEND
                </span>
              )}
            </div>
            {user.bio && (
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate max-w-48 italic">
                "{user.bio}"
              </div>
            )}
          </div>
        </div>
        {showFollowButton && (
          <div className="flex gap-2">
            {isFriend ? (
              <button
                onClick={() => handleUnfollow(user.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 text-pink-700 dark:text-pink-300 hover:from-pink-200 hover:to-purple-200 dark:hover:from-pink-800/50 dark:hover:to-purple-800/50 transition-colors"
              >
                <FaUserMinus className="text-xs" />
                Unfriend
              </button>
            ) : isFollowing ? (
              <button
                onClick={() => handleUnfollow(user.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
              >
                <FaUserMinus className="text-xs" />
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => handleFollow(user.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FaUserPlus className="text-xs" />
                Follow
              </button>
            )}
          </div>
        )}
      </div>
    );
  };
  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
              <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-750 rounded-xl">
                <div className="w-12 h-12 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-12"></div>
                  <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="my-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${activeTab === 'suggested' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}
              sm:text-base sm:px-6 sm:py-2.5 md:text-lg md:px-8 md:py-3`}
            onClick={() => setActiveTab('suggested')}
          >
            Suggested
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${activeTab === 'friends' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}
              sm:text-base sm:px-6 sm:py-2.5 md:text-lg md:px-8 md:py-3`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>
        </div>
      </div>
      <div className="w-full">
        {activeTab === 'suggested' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestedUsers.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl shadow bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 transition-all hover:shadow-lg">
                <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-700" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate text-base sm:text-lg md:text-xl">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate sm:text-sm md:text-base">{user.bio}</div>
                </div>
                <button className="ml-2 px-3 py-1.5 rounded bg-primary text-white text-xs sm:text-sm md:text-base font-bold hover:bg-primary-dark transition-all">
                  <FaUserPlus className="inline mr-1" /> Follow
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friends.map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl shadow bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 transition-all hover:shadow-lg">
                <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-700" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate text-base sm:text-lg md:text-xl">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate sm:text-sm md:text-base">{user.bio}</div>
                </div>
                <button className="ml-2 px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs sm:text-sm md:text-base font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
                  <FaUserFriends className="inline mr-1" /> Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

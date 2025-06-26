"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { API_BASE_URL } from "@/lib/api";

interface ProfileStats {
  followers: number;
  following: number;
  friends: number;
  views: number;
  articles: number;
}

interface ProfileData {
  id: number;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  skills: string[];
  interests: string[];
  gender?: string;
  phone?: string;
  username?: string;
  birthday?: string;
  country?: string;
  location?: string;
  language?: string;
  timezone?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  role?: string;
  createdAt?: string;
}

interface ProfileContextType {
  user: ProfileData | null;
  stats: ProfileStats | null;
  loading: boolean;
  updateProfile: (updates: Partial<ProfileData>) => Promise<void>;
  updateStats: (updates: Partial<ProfileStats>) => void;
  refreshProfile: () => Promise<void>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Fetch user profile data
      const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        setUser(userData);
        
        // Fetch social stats in parallel
        const [followersRes, followingRes, friendsRes, viewsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/followers`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/users/following`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/users/friends`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/users/profile-views`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        const [followers, following, friends, views] = await Promise.all([
          followersRes.ok ? followersRes.json() : [],
          followingRes.ok ? followingRes.json() : [],
          friendsRes.ok ? friendsRes.json() : [],
          viewsRes.ok ? viewsRes.json() : { views: 0 }
        ]);
        
        setStats({
          followers: followers.length || 0,
          following: following.length || 0,
          friends: friends.length || 0,
          views: views.views || 0,
          articles: userData.articles?.length || 0
        });
      } else {
        // Fallback to localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const fallbackUser = JSON.parse(userStr);
          setUser(fallbackUser);
          setStats({ followers: 0, following: 0, friends: 0, views: 0, articles: 0 });
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      showNotification("Failed to load profile data", "error");
      
      // Fallback to localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const fallbackUser = JSON.parse(userStr);
        setUser(fallbackUser);
        setStats({ followers: 0, following: 0, friends: 0, views: 0, articles: 0 });
      }
    }
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        const responseData = await response.json();
        // The response contains { message, user } structure
        const updatedUser = responseData.user || responseData;
        
        // Update local state immediately
        setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
        
        // Update localStorage with the new data
        const userToStore = { ...user, ...updatedUser };
        localStorage.setItem("user", JSON.stringify(userToStore));
        
        // Trigger storage event to notify other components (like AuthStatus)
        window.dispatchEvent(new Event('storage'));
        
        // Also trigger a custom event for immediate updates
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
          detail: userToStore 
        }));
        
        showNotification("Profile updated successfully", "success");
        return Promise.resolve();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      showNotification(error instanceof Error ? error.message : "Failed to update profile", "error");
      return Promise.reject(error);
    }
  };

  const updateStats = (updates: Partial<ProfileStats>) => {
    setStats(prev => prev ? { ...prev, ...updates } : updates as ProfileStats);
  };

  const refreshProfile = async () => {
    setLoading(true);
    await fetchProfileData();
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const value: ProfileContextType = {
    user,
    stats,
    loading,
    updateProfile,
    updateStats,
    refreshProfile,
    showNotification,
    notification
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

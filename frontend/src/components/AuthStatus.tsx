"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { checkAuth, logout, getDashboardUrl, getRoleName } from "../lib/auth-redirect";
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import Toast from "./Toast";

export default function AuthStatus() {
  const [authState, setAuthState] = useState({ isAuthenticated: false, user: null, hasRole: false });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const auth = checkAuth();
      setAuthState(auth);
      setIsLoading(false);
    };

    checkAuthentication();
    
    // Check auth state when component mounts and on storage changes
    const handleStorageChange = () => checkAuthentication();
    const handleProfileUpdate = (event: CustomEvent) => {
      // Update auth state with new user data when profile is updated
      const updatedUser = event.detail;
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userProfileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userProfileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  const handleLogout = () => {
    setShowToast(true);
    setTimeout(() => {
      logout('/');
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full h-8 w-8"></div>
      </div>
    );
  }

  if (!authState.isAuthenticated || !authState.user) {
    return (
      <div className="flex items-center space-x-2">
        <Link 
          href="/login" 
          className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const { user } = authState;
  const dashboardUrl = getDashboardUrl(user);
  const roleName = getRoleName((user as any).role);

  // Helper functions for display
  const getDisplayName = () => {
    const userAny = user as any;
    if (userAny.name && userAny.name.trim()) {
      return userAny.name;
    }
    
    // Construct from parts
    const parts = [];
    if (userAny.firstName) parts.push(userAny.firstName);
    if (userAny.lastName) parts.push(userAny.lastName);
    
    if (parts.length > 0) {
      return parts.join(' ');
    }
    
    return userAny.username || userAny.email?.split('@')[0] || 'User';
  };

  const getDisplayInitials = () => {
    const name = getDisplayName();
    const nameParts = name.split(' ').filter((part: string) => part.length > 0);
    
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const getUserAvatar = () => {
    const userAny = user as any;
    return userAny.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=0ea5e9&color=ffffff&size=32`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isDropdownOpen}
        aria-haspopup={true}
      >
        {(user as any).avatar ? (
          <img 
            src={getUserAvatar()} 
            alt={getDisplayName()} 
            className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600" 
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
            {getDisplayInitials()}
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {getDisplayName()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {roleName}
          </p>
        </div>
        <FaChevronDown className={`text-gray-400 text-xs transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                {(user as any).avatar ? (
                  <img 
                    src={getUserAvatar()} 
                    alt={getDisplayName()} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" 
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getDisplayInitials()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(user as any).email}
                  </p>
                </div>
              </div>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {roleName}
              </span>
            </div>
            <div className="py-2">
              <Link
                href="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
              >
                <FaUser className="mr-3 text-gray-400" />
                My Profile
              </Link>
              <Link
                href={dashboardUrl}
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
              >
                <FaUser className="mr-3 text-gray-400" />
                Dashboard
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold"
              >
                <FaCog className="mr-3 text-gray-400" />
                Settings
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold"
              >
                <FaSignOutAlt className="mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      <Toast message="Signed out successfully" show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}

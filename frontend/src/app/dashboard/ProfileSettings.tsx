"use client";
import { useState, useEffect } from "react";

interface Profile {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  birthday?: string;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [avatarFile]);

  async function fetchProfile() {
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile || {});
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      // Upload avatar if selected
      let avatarUrl = profile.avatar;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        
        const uploadResponse = await fetch('http://localhost:5000/api/upload/avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          avatarUrl = uploadData.url;
        }
      }

      // Update profile
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...profile,
          avatar: avatarUrl
        })
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setAvatarFile(null);
        setPreviewUrl(null);
        await fetchProfile();
        // Update localStorage user for UI consistency
        const updated = await response.json();
        if (updated && updated.id) {
          localStorage.setItem('user', JSON.stringify(updated));
        }
      } else {
        setMessage("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-accent rounded-2xl shadow-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded-full w-20 mx-auto mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-accent rounded-2xl shadow-card p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>👤</span>
        Profile Settings
      </h2>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {previewUrl || profile.avatar ? (
                <img 
                  src={previewUrl || profile.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-400">
                  {'👤'}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary-dark transition-colors">
              <span className="text-xs">📷</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">Click the camera icon to change your avatar</p>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">First Name</label>
            <input
              type="text"
              value={profile.firstName || ""}
              onChange={e => setProfile({...profile, firstName: e.target.value})}
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Last Name</label>
            <input
              type="text"
              value={profile.lastName || ""}
              onChange={e => setProfile({...profile, lastName: e.target.value})}
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Birthday</label>
          <input
            type="date"
            value={profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : ""}
            onChange={e => setProfile({...profile, birthday: e.target.value})}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Bio</label>
          <textarea
            value={profile.bio || ""}
            onChange={e => setProfile({...profile, bio: e.target.value})}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
            placeholder="Tell us about yourself..."
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {profile.bio?.length || 0}/500 characters
          </p>
        </div>

        {/* Account Information (Read-only) */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{localStorage.getItem('email')}</p>
            </div>
            <div>
              <span className="text-gray-500">Username:</span>
              <p className="font-medium">{localStorage.getItem('username')}</p>
            </div>
            <div>
              <span className="text-gray-500">Role:</span>
              <p className="font-medium capitalize">{localStorage.getItem('role') || 'User'}</p>
            </div>
            <div>
              <span className="text-gray-500">Member since:</span>
              <p className="font-medium">June 2025</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary text-white p-3 rounded-xl font-semibold hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="animate-spin">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Changes
              </>
            )}
          </button>
          <button
            onClick={fetchProfile}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`text-center p-3 rounded-xl ${
            message.includes("successfully") 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

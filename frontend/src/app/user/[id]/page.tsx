"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

interface UserProfile {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  interests: string[];
  country?: string;
  location?: string;
  joinedAt: string;
  stats: {
    articles: number;
    followers: number;
    following: number;
  };
  recentArticles: Array<{
    id: number;
    title: string;
    summary?: string;
    imageUrl?: string;
    category: string;
    tags: string[];
    views: number;
    likes: number;
    createdAt: string;
  }>;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    // Get current user ID from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
      } catch (error) {
        console.error("Failed to parse token:", error);
      }
    }
    
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      
      if (response.ok) {
        const userData = await response.json();
        setProfile(userData);
        
        // Check if current user is following this user
        const token = localStorage.getItem("token");
        if (token) {
          const followingRes = await fetch(`${API_BASE_URL}/api/users/following`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (followingRes.ok) {
            const followingData = await followingRes.json();
            setIsFollowing(followingData.some((user: any) => user.id === parseInt(userId)));
          }
        }
      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      router.push('/404');
    }
    setLoading(false);
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setIsFollowing(true);
        // Update follower count
        if (profile) {
          setProfile({
            ...profile,
            stats: {
              ...profile.stats,
              followers: profile.stats.followers + 1
            }
          });
        }
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/unfollow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setIsFollowing(false);
        // Update follower count
        if (profile) {
          setProfile({
            ...profile,
            stats: {
              ...profile.stats,
              followers: profile.stats.followers - 1
            }
          });
        }
      }
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
  };

  const getUserAvatar = () => {
    return profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || '')}&background=0ea5e9&color=ffffff&size=120`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">User Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={getUserAvatar()}
              alt={profile.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {profile.name}
              </h1>
              
              {profile.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                  {profile.bio}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500 mb-4">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    📍 {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  📅 Joined {formatDate(profile.joinedAt)}
                </span>
              </div>
              
              <div className="flex gap-6 justify-center md:justify-start mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {profile.stats.articles}
                  </div>
                  <div className="text-sm text-gray-500">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {profile.stats.followers}
                  </div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {profile.stats.following}
                  </div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
              
              {/* Follow Button */}
              {currentUserId && currentUserId !== profile.id && (
                <div className="flex gap-3 justify-center md:justify-start">
                  {isFollowing ? (
                    <button
                      onClick={handleUnfollow}
                      className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollow}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Follow
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/messages/${profile.id}`)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Skills & Interests */}
          <div className="space-y-6">
            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {profile.interests.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recent Articles */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className="text-xl">📝</span>
                Recent Articles ({profile.recentArticles.length})
              </h3>
              
              {profile.recentArticles.length > 0 ? (
                <div className="grid gap-4">
                  {profile.recentArticles.map((article) => (
                    <div
                      key={article.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/articles/${article.id}`)}
                    >
                      <div className="flex gap-4">
                        {article.imageUrl && (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                            {article.title}
                          </h4>
                          {article.summary && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {article.summary}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {article.category}
                              </span>
                              <span>{article.views} views</span>
                              <span>{article.likes} likes</span>
                            </div>
                            <span>{formatDate(article.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">📝</span>
                  No articles published yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

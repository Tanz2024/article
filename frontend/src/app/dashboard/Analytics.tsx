// src/app/dashboard/Analytics.tsx
"use client";
import { useEffect, useState } from "react";

interface Article {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  views: number;
  shares: number;
  likes: number;
  comments: number;
}

interface AnalyticsData {
  articles: Article[];
  totals: {
    views: number;
    shares: number;
    likes: number;
    comments: number;
  };
}

export default function Analytics({ userId }: { userId: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const response = await fetch('http://localhost:5000/api/analytics/user/summary', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON response, got: ${text.substring(0, 100)}`);
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId]);

  if (loading) return <p className="text-white">Loading analytics...</p>;
  if (error) return <p className="text-red-400">Error: {error}</p>;
  if (!data) return <p className="text-white">No analytics found.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-white">My Article Analytics</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300">Total Views</h3>
          <p className="text-2xl font-bold text-white">{data.totals.views.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300">Total Likes</h3>
          <p className="text-2xl font-bold text-white">{data.totals.likes.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300">Total Shares</h3>
          <p className="text-2xl font-bold text-white">{data.totals.shares.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300">Total Comments</h3>
          <p className="text-2xl font-bold text-white">{data.totals.comments.toLocaleString()}</p>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <h3 className="text-lg font-semibold text-white p-4 border-b border-gray-700">Article Performance</h3>
        {data.articles.length === 0 ? (
          <p className="text-gray-300 p-4">No articles published yet.</p>
        ) : (
          <div className="divide-y divide-gray-700">
            {data.articles.map((article) => (
              <div key={article.id} className="p-4 hover:bg-gray-750 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white truncate flex-1 mr-4">{article.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    article.status === 'PUBLISHED' 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-yellow-900 text-yellow-200'
                  }`}>
                    {article.status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Views: </span>
                    <span className="text-white font-medium">{article.views.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Likes: </span>
                    <span className="text-white font-medium">{article.likes.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Shares: </span>
                    <span className="text-white font-medium">{article.shares.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Comments: </span>
                    <span className="text-white font-medium">{article.comments.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Published: {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

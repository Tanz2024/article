// src/app/admin/SiteAnalytics.tsx
"use client";
import { useEffect, useState } from "react";

export default function SiteAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/articles/site-analytics")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading site analytics...</p>;
  if (!data) return <p>No analytics found.</p>;
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Site Analytics</h2>
      <ul>
        <li>Total Articles: {data.totalArticles}</li>
        <li>Total Views: {data.totalViews}</li>
        <li>Most Read: {data.mostRead?.title} ({data.mostRead?.views} views)</li>
      </ul>
    </div>
  );
}

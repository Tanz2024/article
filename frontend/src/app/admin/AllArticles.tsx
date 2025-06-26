"use client";
import { useEffect, useState } from "react";
import { fetchAllArticles, approveArticle, rejectArticle } from "../../lib/adminApi";

export default function AllArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllArticles().then(setArticles).finally(() => setLoading(false));
  }, []);

  async function handleApprove(id: string) {
    await approveArticle(id);
    setArticles(articles.map(a => a.id === id ? { ...a, status: "approved" } : a));
  }
  async function handleReject(id: string) {
    await rejectArticle(id);
    setArticles(articles.map(a => a.id === id ? { ...a, status: "rejected" } : a));
  }

  if (loading) return <p>Loading...</p>;
  if (!articles.length) return <p>No articles found.</p>;
  return (
    <div className="grid gap-4">
      {articles.map(article => (
        <div key={article.id} className="border rounded p-4">
          <h2 className="text-lg font-semibold">{article.title}</h2>
          <p>Status: {article.status}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleApprove(article.id)} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
            <button onClick={() => handleReject(article.id)} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

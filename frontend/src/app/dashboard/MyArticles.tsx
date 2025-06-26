"use client";
import { useEffect, useState } from "react";
import { fetchUserArticles, deleteUserArticle, updateUserArticle } from "../../lib/userApi";
import EditArticleModal from "./EditArticleModal";

export default function MyArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    fetchUserArticles().then(setArticles).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    await deleteUserArticle(id);
    setArticles(articles.filter(a => a.id !== id));
  }

  async function handleSave(updated: any) {
    await updateUserArticle(updated.id, updated);
    setArticles(articles.map(a => (a.id === updated.id ? updated : a)));
  }

  if (loading) return <p className="py-8 text-center text-gray-500">Loading...</p>;
  if (!articles.length) return <p className="py-8 text-center text-gray-500">No articles found.</p>;
  return (
    <div className="grid gap-4">
      {articles.map(article => (
        <div key={article.id} className="bg-white dark:bg-accent border rounded-xl p-6 shadow-card flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{article.title}</h2>
          <p>Status: <span className="font-semibold text-primary">{article.status}</span></p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditing(article)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
            <button onClick={() => handleDelete(article.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
          </div>
        </div>
      ))}
      {editing && (
        <EditArticleModal
          article={editing}
          onSave={async (updated) => {
            await handleSave(updated);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

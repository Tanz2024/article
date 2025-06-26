"use client";
import { useEffect, useState } from "react";
import { fetchFlaggedArticles } from "../../lib/moderationApi";

export default function FlaggedArticlesPanel() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlaggedArticles().then(setArticles).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading flagged articles...</p>;
  if (!articles.length) return <p>No flagged articles.</p>;
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Flagged Articles</h2>
      <ul>
        {articles.map(article => (
          <li key={article.id} className="mb-2">
            <span className="font-semibold">{article.title}</span> (Flagged)
          </li>
        ))}
      </ul>
    </div>
  );
}

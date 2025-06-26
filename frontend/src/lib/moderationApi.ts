// src/lib/moderationApi.ts
export async function flagArticle(articleId: string) {
  const res = await fetch(`http://localhost:5000/api/articles/${articleId}/flag`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to flag article");
  return res.json();
}

export async function fetchFlaggedArticles() {
  const res = await fetch("http://localhost:5000/api/articles/flagged");
  if (!res.ok) throw new Error("Failed to fetch flagged articles");
  return res.json();
}

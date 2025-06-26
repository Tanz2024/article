// src/lib/adminApi.ts
export async function fetchAllArticles() {
  const res = await fetch("http://localhost:5000/api/articles/all");
  if (!res.ok) throw new Error("Failed to fetch all articles");
  return res.json();
}

export async function approveArticle(articleId: string) {
  const res = await fetch(`http://localhost:5000/api/articles/approve/${articleId}`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to approve article");
  return res.json();
}

export async function rejectArticle(articleId: string) {
  const res = await fetch(`http://localhost:5000/api/articles/reject/${articleId}`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to reject article");
  return res.json();
}

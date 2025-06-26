import ArticleList from "../../components/ArticleList";
import { fetchArticles } from "../../lib/api";

export default async function TagPage({ params }: { params: { tag: string } }) {
  // TODO: Replace with backend filter by tag
  const allArticles = await fetchArticles();
  const articles = allArticles.filter((a: any) => a.tags?.includes(params.tag));
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tag: {params.tag}</h1>
      <ArticleList articles={articles} />
    </main>
  );
}

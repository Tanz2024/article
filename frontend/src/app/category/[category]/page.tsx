import ArticleList from "@/components/ArticleList";
import { fetchArticles } from "@/lib/api";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  // TODO: Replace with backend filter by category
  const allArticles = await fetchArticles();
  const articles = allArticles.filter((a: any) => a.category === params.category);
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Category: {params.category}</h1>
      <ArticleList articles={articles} />
    </main>
  );
}

import { fetchArticleById, articlesAPI } from "../../../lib/api";
import { notFound } from "next/navigation";
import Comments from "../../../components/Comments";
import { FaTwitter, FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa6";
import Link from "next/link";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  let article;
  let relatedArticles = [];
  try {
    article = await fetchArticleById(params.id);
    relatedArticles = await articlesAPI.getRelated(Number(params.id));
  } catch {
    return notFound();
  }
  if (!article) return notFound();

  // Estimate read time (200 words/min)
  const wordCount = article.content ? article.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <main className="min-h-screen bg-[#ffffff] dark:bg-[#0a0a0a] font-sans py-0">
      {/* Visual Header */}
      {article.imageUrl && (
        <div className="w-full h-80 sm:h-[420px] bg-black/10 dark:bg-black/40 relative flex items-center justify-center overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover object-center absolute top-0 left-0 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10" />
          <h1 className="relative z-20 text-white text-4xl sm:text-5xl font-extrabold drop-shadow-xl text-center px-4 max-w-3xl mx-auto">
            {article.title}
          </h1>
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 sm:px-0 -mt-16 relative z-30">
        <article className="bg-white dark:bg-[#18181b] p-8 sm:p-12 rounded-3xl shadow-2xl border border-[#e5e7eb] dark:border-[#222] -mt-24 mb-10">
          {/* Category & Tags */}
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="bg-[#3b82f6]/10 text-[#3b82f6] px-4 py-1 rounded-full font-semibold text-sm uppercase tracking-wide">
              {article.category}
            </span>
            {article.tags && article.tags.length > 0 && article.tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="bg-[#e5e7eb] dark:bg-[#222] text-[#6366f1] px-3 py-1 rounded-full text-xs font-semibold">
                #{tag}
              </span>
            ))}
          </div>
          {/* Headline */}
          {!article.imageUrl && (
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-[#111] dark:text-[#fff] leading-tight">
              {article.title}
            </h1>
          )}
          {/* Author, Date, Read Time */}
          <div className="flex flex-wrap gap-4 items-center text-[#6b7280] dark:text-[#9ca3af] text-sm mb-8">
            {article.author && (
              <span className="font-semibold">By {article.author}</span>
            )}
            {article.publishedAt && (
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            )}
            <span className="flex items-center gap-1">{readTime} min read</span>
          </div>
          {/* Content */}
          <div
            className="prose prose-lg max-w-none mb-10 text-[#333] dark:text-[#cccccc] prose-headings:text-[#111] dark:prose-headings:text-[#fff] prose-blockquote:border-l-4 prose-blockquote:border-[#3b82f6] prose-blockquote:pl-4 prose-blockquote:text-[#6366f1] prose-img:rounded-xl prose-img:shadow-lg prose-a:text-[#3b82f6] dark:prose-a:text-[#3b82f6] prose-strong:text-[#111] dark:prose-strong:text-[#fff]"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          {/* Social Share Buttons */}
          <div className="flex gap-4 items-center border-t border-[#e5e7eb] dark:border-[#222] pt-6 mb-8">
            <button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-xl font-semibold transition-colors">
              <FaTwitter />
              Share on Twitter
            </button>
            <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4338ca] text-white px-5 py-2 rounded-xl font-semibold transition-colors">
              <FaFacebookF />
              Share on Facebook
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-br from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white px-5 py-2 rounded-xl font-semibold transition-colors">
              <FaInstagram />
              Share on Instagram
            </button>
            <button className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2 rounded-xl font-semibold transition-colors">
              <FaWhatsapp />
              Share on WhatsApp
            </button>
            <button className="flex items-center gap-2 bg-[#e5e7eb] dark:bg-[#222] text-[#ef4444] px-5 py-2 rounded-xl font-semibold transition-colors">
              Like
            </button>
            <button className="flex items-center gap-2 bg-[#e5e7eb] dark:bg-[#222] text-[#6366f1] px-5 py-2 rounded-xl font-semibold transition-colors">
              Bookmark
            </button>
          </div>
          {/* Newsletter/CTA */}
          <div className="bg-gradient-to-r from-[#3b82f6]/10 to-[#ef4444]/10 rounded-2xl p-8 text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 text-[#171717] dark:text-[#f4f4f4]">Stay Updated</h3>
            <p className="text-[#6b7280] dark:text-[#9ca3af] mb-4">Subscribe to our newsletter for the latest news and exclusive content.</p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-xl border border-[#e5e7eb] dark:border-[#222] bg-white dark:bg-[#18181b] text-[#171717] dark:text-[#f4f4f4]" />
              <button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-xl font-semibold transition-colors">Subscribe</button>
            </form>
          </div>
          {/* Related Articles (dynamic) */}
          <div className="mt-12">
            <h4 className="text-xl font-bold mb-4 text-[#171717] dark:text-[#f4f4f4]">Related Articles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.length === 0 && (
                <div className="text-[#6b7280] dark:text-[#9ca3af]">No related articles found.</div>
              )}
              {relatedArticles.map((rel: any) => {
                // Estimate read time for related article
                const relWordCount = rel.content ? rel.content.split(/\s+/).length : 0;
                const relReadTime = Math.max(1, Math.round(relWordCount / 200));
                return (
                  <Link key={rel.id} href={`/article/${rel.id}`} className="block bg-[#f8fafc] dark:bg-[#18181b] rounded-xl p-5 shadow hover:shadow-lg border border-[#e5e7eb] dark:border-[#222] transition-all">
                    <div className="text-[#3b82f6] font-bold mb-1 text-xs uppercase">{rel.category}</div>
                    <div className="font-semibold text-lg text-[#171717] dark:text-[#f4f4f4] mb-2">{rel.title}</div>
                    <div className="text-[#6b7280] dark:text-[#9ca3af] text-xs">{new Date(rel.createdAt).toLocaleDateString()} • {relReadTime} min read</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </article>
        {/* Comments Section */}
        <Comments articleId={params.id} />
      </div>
    </main>
  );
}

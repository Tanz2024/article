// src/components/FeaturedSections.tsx
"use client";
import Link from "next/link";
import { FaFire, FaCrown, FaChartLine, FaEye, FaClock, FaArrowRight, FaUser } from "react-icons/fa";

interface Article {
  id: string;
  title: string;
  summary?: string;
  content: string;
  imageUrl?: string;
  author?: string;
  publishedAt: string;
  category: string;
  views?: number;
}

interface FeaturedSectionsProps {
  articles: Article[];
}

function getReadingTime(content: string) {
  const words = content?.split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 200));
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    Politics: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    Technology: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    Sports: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    Health: "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300",
    Business: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
    Science: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
    World: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
    Local: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    Opinion: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300"
  };
  return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
}

// Compact Article Card Component
function CompactArticleCard({ article, index, showRanking = false }: { article: Article; index: number; showRanking?: boolean }) {
  const views = article.views || Math.floor(Math.random() * 10000) + 500;
  
  return (
    <Link href={`/article/${article.id}`} className="group block">
      <article className="flex gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary/30 transition-all duration-200">
        {/* Ranking Number */}
        {showRanking && (
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent text-white rounded-full flex items-center justify-center font-bold text-sm">
            {index + 1}
          </div>
        )}
        
        {/* Thumbnail */}
        {article.imageUrl && (
          <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
          </div>
          
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2 text-sm leading-snug mb-2">
            {article.title}
          </h3>
          
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {article.author && (
              <span className="flex items-center gap-1">
                <FaUser /> {article.author}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FaEye /> {views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <FaClock /> {getReadingTime(article.content)}m
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Section Header Component
function SectionHeader({ title, icon: Icon, color, viewAllHref }: { 
  title: string; 
  icon: any; 
  color: string; 
  viewAllHref: string; 
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <Link 
        href={viewAllHref}
        className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
      >
        View All <FaArrowRight />
      </Link>
    </div>
  );
}

export default function FeaturedSections({ articles }: FeaturedSectionsProps) {
  // Mock data - in real app, these would come from API endpoints
  const mostReadArticles = [...articles]
    .sort((a, b) => (b.views || Math.random() * 10000) - (a.views || Math.random() * 10000))
    .slice(0, 5);
    
  const editorsPickArticles = articles
    .filter(article => article.imageUrl) // Articles with images are more likely to be editor's picks
    .slice(0, 5);
    
  const trendingArticles = [...articles]
    .sort(() => Math.random() - 0.5) // Random for demo - in real app, this would be based on engagement metrics
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Most Read Section */}
        <div>
          <SectionHeader 
            title="Most Read" 
            icon={FaEye} 
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            viewAllHref="/most-read"
          />
          <div className="space-y-4">
            {mostReadArticles.map((article, index) => (
              <CompactArticleCard 
                key={article.id} 
                article={article} 
                index={index} 
                showRanking={true}
              />
            ))}
          </div>
        </div>

        {/* Editor's Choice Section */}
        <div>
          <SectionHeader 
            title="Editor's Choice" 
            icon={FaCrown} 
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            viewAllHref="/editors-choice"
          />
          <div className="space-y-4">
            {editorsPickArticles.map((article, index) => (
              <CompactArticleCard 
                key={article.id} 
                article={article} 
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Trending Now Section */}
        <div>
          <SectionHeader 
            title="Trending Now" 
            icon={FaChartLine} 
            color="bg-gradient-to-r from-red-500 to-red-600"
            viewAllHref="/trending"
          />
          <div className="space-y-4">
            {trendingArticles.map((article, index) => (
              <CompactArticleCard 
                key={article.id} 
                article={article} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

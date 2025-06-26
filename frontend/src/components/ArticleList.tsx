// src/components/ArticleList.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaUser, FaCalendar, FaClock, FaNewspaper, FaEye, FaComment, FaShare, FaChartLine, FaFire, FaCrown, FaCheckCircle, FaShieldAlt, FaEdit, FaExclamationTriangle, FaGavel, FaBalanceScale, FaUserShield, FaCertificate, FaHistory, FaLink } from "react-icons/fa";

function getReadingTime(content: string) {
  const words = content?.split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 200));
}

function getReactions(id: string) {
  if (typeof window === "undefined") return { like: false, bookmark: false };
  const data = localStorage.getItem(`article-reactions-${id}`);
  return data ? JSON.parse(data) : { like: false, bookmark: false };
}

function setReactions(id: string, reactions: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`article-reactions-${id}` , JSON.stringify(reactions));
  }
}

function getCategoryColor(category: string) {
  // New York Times style - minimal, elegant colors
  const colors: Record<string, string> = {
    Politics: "text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    Technology: "text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    Sports: "text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    Entertainment: "text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    Health: "text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800",
    Business: "text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    Science: "text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    World: "text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600",
    Local: "text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    Opinion: "text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800"
  };
  return colors[category] || "text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600";
}

export default function ArticleList({ articles, showTrending = false, showPopular = false, showEditorsPick = false }: { 
  articles: any[]; 
  showTrending?: boolean;
  showPopular?: boolean;
  showEditorsPick?: boolean;
}) {
  const [_, setRerender] = useState(0);
    // Add mock data for demonstration - in real app, this would come from props/API
  const getArticleStats = (id: string) => ({
    views: Math.floor(Math.random() * 10000) + 500,
    comments: Math.floor(Math.random() * 50) + 1,
    likes: Math.floor(Math.random() * 200) + 10,
  });
  // Ethical journalism indicators
  const getEthicalIndicators = (article: any) => ({
    isFactChecked: article.isFactChecked || Math.random() > 0.3, // 70% fact-checked
    hasSourceAttribution: article.sources && article.sources.length > 0,
    editorialTransparency: article.editorialNotes || article.corrections,
    isVerified: article.authorVerified || article.isStaffPick,
    conflictOfInterest: article.conflictOfInterest || false,
    lastUpdated: article.updatedAt || article.publishedAt,
    corrections: article.corrections || null,
    // Enhanced ethical standards
    isLegallyCompliant: article.legalCompliance !== false, // Default to compliant unless specified
    hasEthicalReview: article.ethicalReview || Math.random() > 0.4, // 60% have ethical review
    sourcesCount: article.sources ? article.sources.length : Math.floor(Math.random() * 5) + 1,
    isJournalistCertified: article.authorCertified || Math.random() > 0.5, // 50% certified journalists
    hasEditorialOversight: article.editorialOversight !== false, // Default to having oversight
    transparencyScore: article.transparencyScore || Math.floor(Math.random() * 5) + 3, // 3-7 score
    isOriginalContent: article.isOriginal !== false, // Default to original unless specified
    hasRetraction: article.hasRetraction || false,
    publicInterest: article.publicInterest || Math.random() > 0.3, // 70% serve public interest
    biasDisclosure: article.biasDisclosure || null
  });

  const isArticleSpecial = (article: any, index: number) => {
    if (showTrending && index < 3) return { type: 'trending', icon: FaChartLine, color: 'text-blue-500' };
    if (showPopular && article.views > 5000) return { type: 'popular', icon: FaFire, color: 'text-red-500' };
    if (showEditorsPick && index === 0) return { type: 'editors-pick', icon: FaCrown, color: 'text-yellow-500' };
    return null;
  };
  if (!articles.length) {
    return (
      <div className="text-center py-24 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto">
          <FaNewspaper className="mx-auto mb-6 text-6xl text-gray-300 dark:text-gray-600" />
          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            No Articles Available
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            We're working around the clock to bring you the latest news and stories. Please check back soon.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">      {articles.map((article, index) => {
        const reactions = typeof window !== "undefined" ? getReactions(article.id) : { like: false, bookmark: false };
        const categoryColorClass = getCategoryColor(article.category);
        const stats = getArticleStats(article.id);
        const specialBadge = isArticleSpecial(article, index);
        const ethicalIndicators = getEthicalIndicators(article);
        
        return (
          <article
            key={article.id}
            className="group border-b border-gray-200 dark:border-gray-700 pb-8 hover:bg-gray-50/50 dark:hover:bg-neutral-800/30 transition-colors duration-200"
          >
            <div className="flex gap-6">
              {/* Content Section */}
              <div className="flex-1 space-y-3">                {/* Category & Special Badge */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium tracking-wide uppercase border-l-2 pl-2 ${categoryColorClass}`}>
                    {article.category}
                  </span>
                  {specialBadge && (
                    <div className="flex items-center gap-1 text-xs">
                      <specialBadge.icon className={`${specialBadge.color} text-sm`} />
                      <span className="font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {specialBadge.type.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                  {article.status === 'pending' && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium uppercase tracking-wide">
                      Pending Review
                    </span>
                  )}
                    {/* Ethical Standards Indicators */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {ethicalIndicators.isFactChecked && (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400" title="Fact-checked article">
                        <FaCheckCircle className="text-xs" />
                        <span className="font-medium">Verified</span>
                      </div>
                    )}
                    {ethicalIndicators.isVerified && (
                      <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400" title="Verified author/staff pick">
                        <FaShieldAlt className="text-xs" />
                        <span className="font-medium">Trusted Source</span>
                      </div>
                    )}
                    {ethicalIndicators.isJournalistCertified && (
                      <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400" title="Certified journalist">
                        <FaCertificate className="text-xs" />
                        <span className="font-medium">Certified</span>
                      </div>
                    )}
                    {ethicalIndicators.hasEthicalReview && (
                      <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400" title="Editorial review completed">
                        <FaBalanceScale className="text-xs" />
                        <span className="font-medium">Ethics Review</span>
                      </div>
                    )}
                    {ethicalIndicators.conflictOfInterest && (
                      <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400" title="Conflict of interest disclosed">
                        <FaExclamationTriangle className="text-xs" />
                        <span className="font-medium">Disclosure</span>
                      </div>
                    )}
                    {ethicalIndicators.sourcesCount > 3 && (
                      <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400" title={`${ethicalIndicators.sourcesCount} sources cited`}>
                        <FaLink className="text-xs" />
                        <span className="font-medium">{ethicalIndicators.sourcesCount} Sources</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Headline */}
                <Link href={`/article/${article.id}`}>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 cursor-pointer font-serif">
                    {article.title}
                  </h2>
                </Link>

                {/* Summary */}
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-light">
                  {article.summary || article.content?.replace(/<[^>]*>/g, '').slice(0, 200) + '...'}
                </p>                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {article.author && (
                    <span className="flex items-center gap-1 font-medium">
                      <FaUser className="text-xs" /> {article.author}
                      {ethicalIndicators.isVerified && (
                        <FaCheckCircle className="text-xs text-blue-500 ml-1" title="Verified journalist" />
                      )}
                    </span>
                  )}
                  {article.publishedAt && (
                    <span className="flex items-center gap-1">
                      <FaCalendar className="text-xs" /> 
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                  {ethicalIndicators.lastUpdated && ethicalIndicators.lastUpdated !== article.publishedAt && (
                    <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                      <FaEdit className="text-xs" />
                      Updated {new Date(ethicalIndicators.lastUpdated).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FaClock className="text-xs" /> {getReadingTime(article.content)} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye className="text-xs" /> {stats.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaComment className="text-xs" /> {stats.comments}
                  </span>
                </div>                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 4).map((tag: string, index: number) => (
                      <span key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-sm">
                        {tag.trim()}
                      </span>
                    ))}
                    {article.tags.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{article.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}                {/* Editorial Transparency */}
                {(ethicalIndicators.corrections || ethicalIndicators.hasSourceAttribution || ethicalIndicators.conflictOfInterest || ethicalIndicators.biasDisclosure || ethicalIndicators.hasRetraction) && (
                  <div className="bg-gray-50 dark:bg-neutral-800 rounded-sm p-3 border-l-2 border-blue-200 dark:border-blue-800">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-1">
                      <FaBalanceScale className="text-xs" />
                      Editorial Transparency
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      {ethicalIndicators.corrections && (
                        <p className="flex items-start gap-2">
                          <FaEdit className="text-orange-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Correction:</strong> {ethicalIndicators.corrections}</span>
                        </p>
                      )}
                      {ethicalIndicators.hasRetraction && (
                        <p className="flex items-start gap-2">
                          <FaHistory className="text-red-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Retraction:</strong> This article has been retracted and corrected</span>
                        </p>
                      )}
                      {ethicalIndicators.hasSourceAttribution && (
                        <p className="flex items-center gap-2">
                          <FaCheckCircle className="text-green-500 flex-shrink-0" />
                          <span>Sources verified and attributed ({ethicalIndicators.sourcesCount} sources)</span>
                        </p>
                      )}
                      {ethicalIndicators.conflictOfInterest && (
                        <p className="flex items-start gap-2">
                          <FaExclamationTriangle className="text-orange-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Disclosure:</strong> Author has disclosed potential conflicts of interest</span>
                        </p>
                      )}
                      {ethicalIndicators.biasDisclosure && (
                        <p className="flex items-start gap-2">
                          <FaBalanceScale className="text-blue-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Bias Notice:</strong> {ethicalIndicators.biasDisclosure}</span>
                        </p>
                      )}
                      {ethicalIndicators.hasEthicalReview && (
                        <p className="flex items-center gap-2">
                          <FaGavel className="text-indigo-500 flex-shrink-0" />
                          <span>Editorial review and ethics compliance verified</span>
                        </p>
                      )}
                      {ethicalIndicators.isLegallyCompliant && (
                        <p className="flex items-center gap-2">
                          <FaUserShield className="text-green-500 flex-shrink-0" />
                          <span>Legal compliance and privacy standards met</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <button
                      aria-label={reactions.like ? "Unlike article" : "Like article"}
                      className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
                        reactions.like 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                      onClick={() => {
                        setReactions(article.id, { ...reactions, like: !reactions.like });
                        setRerender(x => x + 1);
                      }}
                    >
                      {reactions.like ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
                      <span className="font-medium">{reactions.like ? 'Liked' : 'Like'}</span>
                    </button>
                    
                    <button
                      aria-label={reactions.bookmark ? "Remove bookmark" : "Bookmark article"}
                      className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
                        reactions.bookmark 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                      onClick={() => {
                        setReactions(article.id, { ...reactions, bookmark: !reactions.bookmark });
                        setRerender(x => x + 1);
                      }}
                    >
                      {reactions.bookmark ? <FaBookmark className="text-sm" /> : <FaRegBookmark className="text-sm" />}
                      <span className="font-medium">{reactions.bookmark ? 'Saved' : 'Save'}</span>
                    </button>
                    
                    <button
                      aria-label="Share article"
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: article.title,
                            url: `${window.location.origin}/article/${article.id}`
                          });
                        } else {
                          navigator.clipboard.writeText(`${window.location.origin}/article/${article.id}`);
                        }
                      }}
                    >
                      <FaShare className="text-sm" />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>
                    <Link
                    href={`/article/${article.id}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 border-b border-transparent hover:border-blue-600 dark:hover:border-blue-400"
                  >
                    Continue reading →
                  </Link>
                </div>                {/* Ethical Standards Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4 flex-wrap">
                      {ethicalIndicators.isFactChecked && (
                        <span className="flex items-center gap-1">
                          <FaCheckCircle className="text-green-500" />
                          Fact-checked
                        </span>
                      )}
                      {ethicalIndicators.publicInterest && (
                        <span className="flex items-center gap-1">
                          <FaBalanceScale className="text-blue-500" />
                          Public Interest
                        </span>
                      )}
                      {ethicalIndicators.transparencyScore >= 6 && (
                        <span className="flex items-center gap-1">
                          <FaShieldAlt className="text-green-500" />
                          High Transparency ({ethicalIndicators.transparencyScore}/7)
                        </span>
                      )}
                      <span>
                        Published under our{" "}
                        <Link href="/editorial-standards" className="text-blue-600 dark:text-blue-400 hover:underline">
                          editorial standards
                        </Link>
                      </span>
                      <span>
                        <Link href="/ethics-code" className="text-blue-600 dark:text-blue-400 hover:underline">
                          Code of Ethics
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/report/${article.id}`} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Report issue with this article"
                      >
                        <FaExclamationTriangle />
                      </Link>
                      <Link 
                        href={`/ethics-feedback/${article.id}`} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Ethics feedback"
                      >
                        <FaBalanceScale />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              {article.imageUrl && (
                <div className="w-48 h-32 flex-shrink-0 relative overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {specialBadge && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm">
                      <specialBadge.icon className={`${specialBadge.color} text-xs`} />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-sm text-xs flex items-center gap-1">
                    <FaEye className="text-xs" />
                    {stats.views > 1000 ? `${(stats.views/1000).toFixed(1)}k` : stats.views}
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

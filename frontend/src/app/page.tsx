"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import ArticleList from "../components/ArticleList";
import HeroSection from "../components/HeroSection";
import FeaturedSections from "../components/FeaturedSections";
import SocialProof from "../components/SocialProof";
import EngagementFeatures from "../components/EngagementFeatures";
import ContentDiscovery from "../components/ContentDiscovery";
import TrustIndicators from "../components/TrustIndicators";
import { articlesAPI, authAPI } from "../lib/api";
import { useEffect, useState } from "react";
import { FaSearch, FaPenNib, FaTwitter, FaFacebookF, FaWhatsapp } from "react-icons/fa";

function shareOn(platform: string, url: string, title: string) {
  if (platform === "twitter") {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    );
  } else if (platform === "facebook") {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    );
  } else if (platform === "whatsapp") {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`
    );
  }
}

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);

    async function loadArticles() {
      try {
        setLoading(true);
        setError("");
        const fetchedArticles = await articlesAPI.getAll();
        // Add mock data for hero articles
        const enhancedArticles = fetchedArticles.map((article: any, index: number) => ({
          ...article,
          isBreaking: index === 0 && Math.random() > 0.7,
          isTrending: index < 3 && Math.random() > 0.5,
          views: Math.floor(Math.random() * 10000) + 500,
        }));
        setArticles(enhancedArticles);
        setFilteredArticles(enhancedArticles);
      } catch (e) {
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    const filtered = articles.filter(
      (a: any) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [articles, search]);

  const handleFilterChange = (filters: any) => {
    let filtered = [...articles];
    
    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((article: any) => 
        filters.categories.includes(article.category)
      );
    }
    
    // Apply search if exists
    if (search) {
      filtered = filtered.filter(
        (a: any) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.category?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
        break;
      case 'trending':
        filtered.sort((a: any, b: any) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
        break;
      case 'latest':
      default:
        filtered.sort((a: any, b: any) => 
          new Date(b.publishedAt || b.createdAt).getTime() - 
          new Date(a.publishedAt || a.createdAt).getTime()
        );
        break;
    }
    
    setFilteredArticles(filtered);
  };

  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-[#0a0a0a] font-sans">
      <Header />
      
      {loading ? (
        <main className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#3b82f6] border-t-transparent mb-6"></div>
          <p className="text-[#333333] dark:text-[#cccccc] text-xl font-medium">
            Loading latest news...
          </p>
        </main>
      ) : error ? (
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="bg-[#fff1f2] dark:bg-[#2a0a0a] border border-[#ef4444] dark:border-[#ef4444] rounded-2xl p-10 max-w-md mx-auto shadow-xl">
            <div className="text-[#ef4444] text-5xl mb-4 text-center">⚠️</div>
            <h3 className="text-2xl font-semibold text-[#ef4444] mb-2 text-center">
              Error Loading News
            </h3>
            <p className="text-[#ef4444] mb-4 text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#ef4444] text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </main>
      ) : (
        <>
          {/* Hero Section - only show if we have articles */}
          {articles.length > 0 && <HeroSection articles={articles} />}
          
          {/* Content Discovery/Filters */}
          <ContentDiscovery 
            articles={articles} 
            onFilterChange={handleFilterChange}
          />
          
          <main className="flex-1">
            {/* Featured Sections - Most Read, Editor's Choice, Trending */}
            {articles.length > 0 && <FeaturedSections articles={articles} />}
            
            {/* Main Articles Section */}
            <div className="container mx-auto px-4 py-12">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-7xl mb-6">📰</div>
                  <h3 className="text-3xl font-serif font-bold mb-3 text-[#171717] dark:text-[#f4f4f4]">
                    No Articles Found
                  </h3>
                  <p className="text-[#6b7280] dark:text-[#9ca3af] mb-8 text-lg">
                    {search
                      ? `No articles match your search`
                      : "No articles available at the moment"}
                  </p>
                  {user && (
                    <Link
                      href="/submit"
                      className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-sm transition-colors font-medium text-lg border border-blue-600"
                    >
                      <FaPenNib className="text-lg" />
                      Be the first to submit
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-12 pb-6 border-b-2 border-gray-900 dark:border-white">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#171717] dark:text-[#f4f4f4] mb-2">
                      {search ? "Search Results" : "Today's Stories"}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {search
                        ? `${filteredArticles.length} articles found`
                        : `${filteredArticles.length} articles • ${new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}`}
                    </p>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <ArticleList 
                      articles={filteredArticles} 
                      showTrending={true}
                      showPopular={true}
                      showEditorsPick={true}
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* Social Proof Section */}
            <SocialProof />
            
            {/* Trust Indicators */}
            <TrustIndicators />
            
            {/* Engagement Features */}
            <EngagementFeatures isAuthenticated={!!user} />
            
            {/* Social Sharing Section */}
            <div className="container mx-auto px-4 py-12">
              <div className="bg-gray-50 dark:bg-neutral-800 rounded-sm p-10 text-center border border-gray-200 dark:border-gray-700">
                <h3 className="text-3xl font-serif font-bold mb-4 text-[#171717] dark:text-[#f4f4f4]">
                  Share Tanznews
                </h3>
                <p className="text-[#6b7280] dark:text-[#9ca3af] mb-8 text-lg">
                  Help us spread quality journalism to more people
                </p>
                <div className="flex gap-6 justify-center flex-wrap">
                  <button
                    onClick={() =>
                      shareOn("twitter", url, "Check out the latest news on Tanznews!")
                    }
                    className="bg-[#1da1f2] text-white px-8 py-4 rounded-sm hover:bg-[#1a8cd8] transition-colors flex items-center gap-3 font-medium text-lg"
                  >
                    <FaTwitter /> Twitter
                  </button>
                  <button
                    onClick={() =>
                      shareOn("facebook", url, "Check out the latest news on Tanznews!")
                    }
                    className="bg-[#4267B2] text-white px-8 py-4 rounded-sm hover:bg-[#365899] transition-colors flex items-center gap-3 font-medium text-lg"
                  >
                    <FaFacebookF /> Facebook
                  </button>
                  <button
                    onClick={() =>
                      shareOn("whatsapp", url, "Check out the latest news on Tanznews!")
                    }
                    className="bg-[#25D366] text-white px-8 py-4 rounded-sm hover:bg-[#20b85a] transition-colors flex items-center gap-3 font-medium text-lg"
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
      
      <Footer />
    </div>
  );
}

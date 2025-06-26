// src/components/EngagementFeatures.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { FaComments, FaPenNib, FaBell, FaEnvelope, FaUserPlus, FaArrowRight, FaUsers, FaHeart } from "react-icons/fa";

interface EngagementFeaturesProps {
  recentComments?: Array<{
    id: string;
    author: string;
    content: string;
    articleTitle: string;
    articleId: string;
    timestamp: string;
  }>;
  isAuthenticated?: boolean;
}

const defaultRecentComments = [
  {
    id: "1",
    author: "Alex Thompson",
    content: "Great analysis! This really helped me understand the current market trends.",
    articleTitle: "Tech Stocks Surge as AI Innovation Accelerates",
    articleId: "tech-stocks-ai",
    timestamp: "2 hours ago"
  },
  {
    id: "2", 
    author: "Maria Garcia",
    content: "I've been following this story closely. Thanks for the comprehensive coverage.",
    articleTitle: "Climate Change Summit Reaches Historic Agreement",
    articleId: "climate-summit",
    timestamp: "4 hours ago"
  },
  {
    id: "3",
    author: "James Wilson",
    content: "Fascinating perspective on the healthcare industry. Looking forward to more articles like this.",
    articleTitle: "Revolutionary Gene Therapy Shows Promise",
    articleId: "gene-therapy",
    timestamp: "6 hours ago"
  }
];

export default function EngagementFeatures({ 
  recentComments = defaultRecentComments,
  isAuthenticated = false 
}: EngagementFeaturesProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setIsSubscribed(true);
    setEmail("");
    // In real app, this would call an API
  };

  return (
    <div className="bg-white dark:bg-neutral-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Join the Discussion Section */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <FaComments className="text-xl text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Join the Discussion
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Connect with fellow readers, share your thoughts, and engage in meaningful conversations about the stories that matter most.
            </p>

            {/* Recent Comments Preview */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Comments</h3>
              {recentComments.slice(0, 2).map((comment) => (
                <div key={comment.id} className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {comment.author[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {comment.content}
                      </p>
                      <Link 
                        href={`/article/${comment.articleId}`}
                        className="text-xs text-primary hover:text-accent transition-colors"
                      >
                        on "{comment.articleTitle}"
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <FaUserPlus /> Join Community
                  </Link>
                  <Link
                    href="/submit"
                    className="flex items-center justify-center gap-2 border border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors"
                  >
                    <FaPenNib /> Submit Article
                  </Link>
                </>
              ) : (
                <Link
                  href="/submit"
                  className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  <FaPenNib /> Submit Your Story
                </Link>
              )}
            </div>
          </div>

          {/* Newsletter & Notifications Section */}
          <div className="space-y-8">
            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-accent/5 to-secondary/5 rounded-3xl p-8 border border-accent/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-accent/10 rounded-full">
                  <FaEnvelope className="text-xl text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Stay Updated
                </h2>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get the latest stories delivered directly to your inbox. No spam, just quality journalism.
              </p>

              {!isSubscribed ? (
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-accent text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaBell /> Subscribe
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    By subscribing, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHeart className="text-2xl text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You've successfully subscribed to our newsletter. Welcome to the community!
                  </p>
                </div>
              )}

              {/* Newsletter Benefits */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Daily digest of top stories</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Exclusive interviews and insights</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Breaking news alerts</span>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl p-8 border border-secondary/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-secondary/10 rounded-full">
                  <FaUsers className="text-xl text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Community Impact
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    12.5K+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Commenters
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    850+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Articles This Month
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    2.8M+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Comments Posted
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    95%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Reader Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

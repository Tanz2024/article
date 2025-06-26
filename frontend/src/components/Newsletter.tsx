// src/components/Newsletter.tsx
"use client";
import { useState } from "react";
import { FaEnvelope, FaBell, FaCheck, FaHeart, FaStar, FaNewspaper, FaUsers } from "react-icons/fa";

interface NewsletterProps {
  variant?: 'inline' | 'popup' | 'sidebar';
  showBenefits?: boolean;
  showStats?: boolean;
}

export default function Newsletter({ 
  variant = 'inline', 
  showBenefits = true, 
  showStats = true 
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  const benefits = [
    { icon: FaNewspaper, text: "Daily digest of top stories" },
    { icon: FaBell, text: "Breaking news alerts" },
    { icon: FaStar, text: "Exclusive interviews and insights" },
    { icon: FaUsers, text: "Community-driven content" }
  ];

  if (isSubscribed) {
    return (
      <div className={`text-center p-8 ${variant === 'popup' ? 'bg-white rounded-2xl shadow-2xl' : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800'}`}>
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-2xl text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to the Community! 🎉
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Thank you for subscribing! You'll receive your first newsletter within 24 hours.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <FaHeart className="text-red-400" />
          <span>Trusted by 250,000+ readers worldwide</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${variant === 'popup' ? 'bg-white rounded-2xl shadow-2xl p-8' : 'bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10'}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <FaEnvelope className="text-2xl text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Stay in the Loop
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get the latest stories delivered directly to your inbox. Join our community of informed readers.
        </p>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">250K+</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Subscribers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">Daily</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Updates</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">95%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Open Rate</div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
            disabled={isLoading}
          />
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Subscribing...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <FaBell />
              Subscribe Now
            </div>
          )}
        </button>
      </form>

      {/* Benefits */}
      {showBenefits && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">
            What You'll Get:
          </h4>
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="text-primary text-xs" />
                </div>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}

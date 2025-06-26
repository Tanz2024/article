// src/components/HeroSection.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaFire, FaBolt, FaClock, FaUser } from "react-icons/fa";

interface Article {
  id: string;
  title: string;
  summary?: string;
  content: string;
  imageUrl?: string;
  author?: string;
  publishedAt: string;
  category: string;
  isBreaking?: boolean;
  isTrending?: boolean;
}

interface HeroSectionProps {
  articles: Article[];
}

export default function HeroSection({ articles }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter for hero articles (trending or breaking)
  const heroArticles = articles.filter(article => 
    article.isBreaking || article.isTrending || article.imageUrl
  ).slice(0, 5);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || heroArticles.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroArticles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroArticles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroArticles.length) % heroArticles.length);
  };

  const getReadingTime = (content: string) => {
    const words = content?.split(/\s+/).length || 0;
    return Math.max(1, Math.round(words / 200));
  };

  if (heroArticles.length === 0) return null;

  const currentArticle = heroArticles[currentSlide];

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-3xl mx-4 mb-12">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {currentArticle.imageUrl ? (
          <img 
            src={currentArticle.imageUrl} 
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary via-accent to-secondary"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-6 pb-12">
          <div className="max-w-4xl">
            {/* Breaking/Trending Badge */}
            {(currentArticle.isBreaking || currentArticle.isTrending) && (
              <div className="flex items-center gap-2 mb-4">
                {currentArticle.isBreaking && (
                  <span className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    <FaBolt /> BREAKING
                  </span>
                )}
                {currentArticle.isTrending && (
                  <span className="inline-flex items-center gap-1 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    <FaFire /> TRENDING
                  </span>
                )}
              </div>
            )}

            {/* Category */}
            <div className="mb-3">
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currentArticle.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {currentArticle.title}
            </h1>

            {/* Summary */}
            {currentArticle.summary && (
              <p className="text-xl text-gray-200 mb-6 leading-relaxed max-w-3xl">
                {currentArticle.summary}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-8">
              {currentArticle.author && (
                <span className="flex items-center gap-2">
                  <FaUser /> {currentArticle.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <FaClock /> {getReadingTime(currentArticle.content)} min read
              </span>
              <span>
                {new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* CTA Button */}
            <Link
              href={`/article/${currentArticle.id}`}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl"
            >
              Read Full Story
              <FaChevronRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {heroArticles.length > 1 && (
        <>
          {/* Arrow Controls */}
          <button
            onClick={prevSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
            aria-label="Previous slide"
          >
            <FaChevronLeft />
          </button>
          
          <button
            onClick={nextSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
            aria-label="Next slide"
          >
            <FaChevronRight />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            {heroArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Thumbnail Navigation */}
      {heroArticles.length > 1 && (
        <div className="absolute bottom-6 left-6 flex gap-3 max-w-md">
          {heroArticles.slice(0, 4).map((article, index) => (
            index !== currentSlide && (
              <button
                key={article.id}
                onClick={() => setCurrentSlide(index)}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className="group relative w-20 h-16 rounded-lg overflow-hidden bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              >
                {article.imageUrl ? (
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/50 to-accent/50"></div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200"></div>
              </button>
            )
          ))}
        </div>
      )}
    </section>
  );
}

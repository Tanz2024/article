// src/components/ContentDiscovery.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { FaFilter, FaSearch, FaTags, FaChevronDown, FaChevronUp, FaTimes, FaNewspaper } from "react-icons/fa";

interface ContentDiscoveryProps {
  articles: any[];
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
  tags: string[];
  dateRange: string;
  sortBy: string;
}

const categories = [
  "Politics", "Technology", "Sports", "Entertainment", 
  "Health", "Business", "Science", "World", "Local", "Opinion"
];

const popularTags = [
  "breaking-news", "analysis", "interview", "investigation", 
  "trending", "exclusive", "deep-dive", "opinion-piece",
  "data-driven", "expert-insight", "global", "local-impact"
];

const dateRanges = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" }
];

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "trending", label: "Trending" },
  { value: "comments", label: "Most Discussed" }
];

export default function ContentDiscovery({ articles, onFilterChange }: ContentDiscoveryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    tags: [],
    dateRange: "all",
    sortBy: "latest"
  });

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    const newFilters = { ...filters, tags: newTags };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleDateRangeChange = (dateRange: string) => {
    const newFilters = { ...filters, dateRange };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters = {
      categories: [],
      tags: [],
      dateRange: "all",
      sortBy: "latest"
    };
    setFilters(newFilters);
    setSearchQuery("");
    onFilterChange?.(newFilters);
  };

  const activeFiltersCount = filters.categories.length + filters.tags.length + 
    (filters.dateRange !== "all" ? 1 : 0) + (filters.sortBy !== "latest" ? 1 : 0);

  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-sm bg-white/95 dark:bg-neutral-900/95">
      <div className="container mx-auto px-4 py-4">
        {/* Search Bar and Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics, or authors..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition-all duration-200 ${
              isExpanded || activeFiltersCount > 0
                ? 'bg-primary text-white border-primary'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
            }`}
          >
            <FaFilter />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            
            {filters.categories.map(category => (
              <span key={category} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                {category}
                <button onClick={() => handleCategoryToggle(category)}>
                  <FaTimes className="hover:text-primary/70" />
                </button>
              </span>
            ))}
            
            {filters.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
                #{tag}
                <button onClick={() => handleTagToggle(tag)}>
                  <FaTimes className="hover:text-accent/70" />
                </button>
              </span>
            ))}
            
            {filters.dateRange !== "all" && (
              <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
                {dateRanges.find(d => d.value === filters.dateRange)?.label}
                <button onClick={() => handleDateRangeChange("all")}>
                  <FaTimes className="hover:text-secondary/70" />
                </button>
              </span>
            )}
            
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                <FaNewspaper className="text-primary" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.categories.includes(category)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                <FaTags className="text-accent" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filters.tags.includes(tag)
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range and Sort */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Date Range
                </h3>
                <div className="space-y-2">
                  {dateRanges.map(range => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="dateRange"
                        value={range.value}
                        checked={filters.dateRange === range.value}
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Sort By
                </h3>
                <div className="space-y-2">
                  {sortOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

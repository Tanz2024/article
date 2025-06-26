"use client";
import { useState } from "react";

interface ArticlePreviewProps {
  title: string;
  content: string;
  category: string;
  tags: string;
  imageUrl?: string;
  author?: string;
}

export default function ArticlePreview({ 
  title, 
  content, 
  category, 
  tags, 
  imageUrl,
  author = "You"
}: ArticlePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  const currentDate = new Date().toLocaleDateString();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mb-4 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 p-3 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
        type="button"
      >
        <span>👁️</span>
        Preview Article
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Preview Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>👁️</span>
            Article Preview
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            {/* Featured Image */}
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}
            
            {/* Article Meta */}
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                {category || 'Uncategorized'}
              </span>
              <span>By {author}</span>
              <span>{currentDate}</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                PREVIEW
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
              {title || "Untitled Article"}
            </h1>
            
            {/* Tags */}
            {tagArray.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tagArray.map((tag, index) => (
                  <span key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-gray-500 italic">No content yet. Start writing your article...</p>
              )}
            </div>
            
            {/* Engagement Section Preview */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-500">
                  <span>❤️</span>
                  <span>0 likes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span>💬</span>
                  <span>0 comments</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span>📤</span>
                  <span>0 shares</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This is how your article will appear to readers
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

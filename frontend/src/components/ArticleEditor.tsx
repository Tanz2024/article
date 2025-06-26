"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Tiptap Editor (for SSR)
const Editor = dynamic(() => import("./Editor"), { ssr: false });

export default function ArticleEditor({
  initialContent = "",
  onSaveDraft,
  onSubmit,
  onPreview,
  categories = [],
  onCategoryChange,
  onFileUpload,
  onImageUpload,
  onVideoUpload,
  isSaving,
  isSubmitting,
  draftId,
  previewContent,
}: {
  initialContent?: string;
  onSaveDraft?: (content: string) => void;
  onSubmit?: (content: string) => void;
  onPreview?: (content: string) => void;
  categories?: string[];
  onCategoryChange?: (cat: string) => void;
  onFileUpload?: (file: File) => void;
  onImageUpload?: (file: File) => void;
  onVideoUpload?: (file: File) => void;
  isSaving?: boolean;
  isSubmitting?: boolean;
  draftId?: string;
  previewContent?: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "file" && onFileUpload) onFileUpload(file);
    if (type === "image" && onImageUpload) onImageUpload(file);
    if (type === "video" && onVideoUpload) onVideoUpload(file);
  };

  // Category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    if (onCategoryChange) onCategoryChange(e.target.value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg p-4 sm:p-8 mt-6 mb-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-blue-700 dark:text-blue-200">Create Article</h1>
      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Category</label>
        <select
          className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {/* File Upload (DOCX/PDF) */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <label className="block text-sm font-semibold">Upload DOCX/PDF</label>
        <input type="file" accept=".doc,.docx,.pdf" onChange={e => handleFileChange(e, "file")}
          className="file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>
      {/* Media Uploads */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <label className="block text-sm font-semibold">Upload Image</label>
        <input type="file" accept="image/*" onChange={e => handleFileChange(e, "image")}
          className="file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
        <label className="block text-sm font-semibold">Upload Video</label>
        <input type="file" accept="video/*" onChange={e => handleFileChange(e, "video")}
          className="file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
      </div>
      {/* Rich Text Editor */}
      <div className="mb-4">
        <Editor value={content} onChange={setContent} />
      </div>
      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <button
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
          onClick={() => { if (onSaveDraft) onSaveDraft(content); }}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save as Draft"}
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold shadow"
          onClick={() => { setShowPreview(true); if (onPreview) onPreview(content); }}
        >
          Preview
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow"
          onClick={() => { if (onSubmit) onSubmit(content); }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Article"}
        </button>
      </div>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setShowPreview(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">Preview</h2>
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: previewContent || content }} />
          </div>
        </div>
      )}
      {/* Cloud sync/draft info */}
      {draftId && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">Draft saved in cloud (ID: {draftId})</div>
      )}
    </div>
  );
}

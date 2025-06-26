"use client";
import { useState } from "react";
import { articlesAPI } from "../../lib/api";
import RequireAuth from "../../components/RequireAuth";
import ArticleEditor from "../../components/ArticleEditor";
import ArticlePreview from "../../components/ArticlePreview";
import Link from "next/link";
import { FaPaperPlane } from "react-icons/fa";

export default function SubmitPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canPreview = title.trim() || content.trim() || category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreeToTerms) {
      setStatus("You must agree to the terms and conditions to submit an article.");
      return;
    }
    if (content.length < 100) {
      setStatus("Article content must be at least 100 characters long.");
      return;
    }
    setIsSubmitting(true);
    setStatus(null);
    try {
      await articlesAPI.create({
        title,
        content,
        category,
        tags,
        imageUrl: image ? URL.createObjectURL(image) : undefined
      });
      setStatus("Submitted successfully! Your article is pending review.");
      setTitle("");
      setCategory("");
      setTags("");
      setContent("");
      setImage(null);
      setAgreeToTerms(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <RequireAuth>
      <main className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#18181b] py-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-primary via-accent to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
              Submit News Article
            </h1>
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-medium">
              Share your story with the world. All submissions are reviewed before publication.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-[#23272f] p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Article Details</h2>
                {canPreview && (
                  <ArticlePreview
                    title={title}
                    content={content}
                    category={category}
                    tags={tags}
                    imageUrl={image ? URL.createObjectURL(image) : undefined}
                  />
                )}
              </div>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="title" className="block text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Article Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter a compelling title for your article"
                    className="w-full border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-white dark:bg-[#18181b] text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-lg"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Category *
                    </label>
                    <select
                      id="category"
                      className="w-full border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-white dark:bg-[#18181b] text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-lg"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Politics">Politics</option>
                      <option value="Technology">Technology</option>
                      <option value="Sports">Sports</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Science">Science</option>
                      <option value="Health">Health</option>
                      <option value="Business">Business</option>
                      <option value="World">World</option>
                      <option value="Local">Local</option>
                      <option value="Opinion">Opinion</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tags" className="block text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Tags
                    </label>
                    <input
                      id="tags"
                      type="text"
                      placeholder="e.g. breaking news, investigation, exclusive"
                      className="w-full border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-white dark:bg-[#18181b] text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-lg"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Article Content *
                  </label>
                  <ArticleEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write your article content here..."
                    initialContent={content}
                    onSaveDraft={() => {/* implement draft save */}}
                    onSubmit={() => {/* implement submit */}}
                    onPreview={() => {/* implement preview */}}
                    categories={["Politics","Technology","Sports","Entertainment","Science","Health","Business","World","Local","Opinion"]}
                    onCategoryChange={setCategory}
                    onFileUpload={setImage}
                    isSaving={false}
                    isSubmitting={isSubmitting}
                    draftId={null}
                    previewContent={content}
                    docId={"draft-submit"} // Use a unique ID per draft/article for real-time collab
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 100 characters required</p>
                </div>
                <div>
                  <label htmlFor="image" className="block text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Featured Image (Optional)
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="w-full border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-white dark:bg-[#18181b] text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-lg"
                    onChange={e => setImage(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x800px, Max size: 10MB</p>
                </div>
                <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-blue-100 dark:from-primary/10 dark:via-accent/10 dark:to-blue-900/10 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={e => setAgreeToTerms(e.target.checked)}
                      className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="terms" className="text-base text-gray-700 dark:text-gray-300">
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-600 underline hover:text-blue-800">
                        Terms of Service
                      </Link>{" "}
                      and confirm that my content is original and accurate.
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!agreeToTerms || !title || !category || !content || isSubmitting}
                  className="w-full bg-gradient-to-r from-primary via-accent to-blue-600 text-white p-5 rounded-2xl font-bold text-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>                  ) : (
                    <>
                      <FaPaperPlane className="text-xl" />
                      Submit Article for Review
                    </>
                  )}
                </button>
              </form>
              {status && (
                <div className={`mt-8 text-center p-5 rounded-2xl ${
                  status.includes("successfully")
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}>
                  {status}
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-[#23272f] p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
                <span>💡</span>
                Writing Tips
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-blue-600 font-bold text-xl">1.</span>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Compelling Headlines</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">Create titles that grab attention while accurately representing your content.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-blue-600 font-bold text-xl">2.</span>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Clear Structure</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">Use headings, paragraphs, and bullet points to make your article easy to read.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-blue-600 font-bold text-xl">3.</span>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Fact-Check</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">Verify all information and cite reliable sources to maintain credibility.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-blue-600 font-bold text-xl">4.</span>
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">Engaging Content</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">Tell a story that connects with readers and provides value.</p>
                  </div>
                </div>
              </div>
              <div className="mt-10 p-5 bg-gradient-to-r from-primary/10 via-accent/10 to-blue-100 dark:from-primary/10 dark:via-accent/10 dark:to-blue-900/10 rounded-xl">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Article Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-base">
                  <div>
                    <span className="text-gray-500">Title:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{title.length}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Content:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{content.length}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{category || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tags:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{tags.split(',').filter(t => t.trim()).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}

import { useState } from "react";

export default function EditArticleModal({ article, onSave, onClose }: {
  article: any;
  onSave: (updated: any) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    await onSave({ ...article, title, content });
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-accent p-6 rounded-xl shadow-card w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Article</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="w-full mb-3 p-2 border rounded min-h-[120px]"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Content"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary-dark transition-colors">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

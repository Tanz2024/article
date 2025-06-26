import { useState } from "react";

export default function ReportArticle({ articleId }: { articleId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    const res = await fetch(`/api/articles/${articleId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });
    if (res.ok) setStatus("Report submitted. Thank you!");
    else setStatus("Failed to submit report.");
    setReason("");
    setTimeout(() => setOpen(false), 1200);
  }

  return (
    <div className="mt-4">
      <button
        className="text-xs text-red-600 underline hover:text-red-800 font-semibold"
        onClick={() => setOpen(true)}
      >
        Report Article
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-accent p-6 rounded-2xl shadow-card w-full max-w-xs flex flex-col gap-3 border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-2 text-red-600">Report Article</h3>
            <textarea
              className="border rounded p-2 min-h-[80px]"
              placeholder="Reason (required)"
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Cancel</button>
              <button type="submit" className="px-3 py-1 rounded bg-primary text-white font-semibold hover:bg-primary-dark">Submit</button>
            </div>
            {status && <div className="text-green-600 text-center mt-2">{status}</div>}
          </form>
        </div>
      )}
    </div>
  );
}

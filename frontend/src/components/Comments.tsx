"use client";
import { useEffect, useState } from "react";

interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
  parentId?: number;
  replies?: Comment[];
}

export default function Comments({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  async function fetchComments() {
    try {
      const response = await fetch(`http://localhost:5000/api/articles/${articleId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function submitComment(content: string, parentId?: number) {
    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content, parentId })
      });

      if (response.ok) {
        await fetchComments(); // Refresh comments
        setNewComment("");
        setReplyContent("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  }

  function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
    return (
      <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
        <div className="bg-background-muted dark:bg-gray-900 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-primary">{comment.authorName || "Anonymous"}</div>
            <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-gray-700 dark:text-gray-200 mb-3">{comment.content}</div>
          
          {/* <button
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-xs text-primary hover:text-primary-dark font-semibold"
          >
            {replyingTo === comment.id ? 'Cancel Reply' : 'Reply'}
          </button> */}

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => submitComment(replyContent, comment.id)}
                  disabled={!replyContent.trim() || submitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-10 bg-white dark:bg-accent rounded-2xl shadow-card p-6">
        <div className="py-6 text-center text-gray-400">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white dark:bg-accent rounded-2xl shadow-card p-6">
      <h3 className="text-lg font-bold mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
        <span>💬</span>
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {localStorage.getItem('token') ? (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {/* {session.user.name?.[0]?.toUpperCase() || 'U'} */}
              U
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {/* {session.user.name || 'User'} */}
              User
            </span>
          </div>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Share your thoughts on this article..."
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-neutral-800 text-black dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
            rows={4}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-500">
              {newComment.length}/500 characters
            </span>
            <button
              onClick={() => submitComment(newComment)}
              disabled={!newComment.trim() || submitting || newComment.length > 500}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-center text-blue-700 dark:text-blue-300">
            <a href="/login" className="font-semibold underline hover:text-blue-800 dark:hover:text-blue-200">
              Sign in
            </a>{" "}
            to join the conversation and share your thoughts on this article.
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <span className="text-2xl mb-2 block">🗨️</span>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}

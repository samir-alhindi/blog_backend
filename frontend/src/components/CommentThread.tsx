"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";
import { usernameFromUserUrl } from "@/lib/url-helpers";
import type { CommentDetail, Paginated } from "@/lib/types";
import ReactionBar from "./ReactionBar";
import { CommentThreadSkeleton } from "./Skeleton";

export default function CommentThread({
  postId,
  postUrl,
}: {
  postId: number;
  postUrl: string;
}) {
  const { user } = useAuth();
  const t = useTranslations("Comments");
  const [comments, setComments] = useState<CommentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const list = await apiFetch<Paginated<CommentDetail>>(
      `${API_BASE_URL}/comments/?post_id=${postId}&page_size=100`
    );
    setComments(Array.isArray(list?.results) ? list.results : []);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  const postComment = async (body: string, parent: string | null) => {
    await apiFetch(`${API_BASE_URL}/comments/`, {
      method: "POST",
      body: JSON.stringify({ body, post: postUrl, parent }),
    });
    await load();
  };

  const handleSubmitTop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await postComment(newComment.trim(), null);
      setNewComment("");
    } finally {
      setSubmitting(false);
    }
  };

  const topLevel = comments.filter((c) => c.parent === null);
  const childrenOf = (commentUrl: string) =>
    comments.filter((c) => c.parent === commentUrl);

  return (
    <section className="mt-12 pb-12">
      <h3 className="font-display text-2xl mb-6">
        {t("responses", { count: comments.length })}
      </h3>

      {user ? (
        <form
          onSubmit={handleSubmitTop}
          className="mb-8 bg-surface-container-low border border-outline-variant p-4 rounded focus-within:border-primary transition-colors"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t("placeholder")}
            rows={3}
            className="w-full bg-transparent resize-none outline-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-on-primary font-ui px-4 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {t("respond")}
            </button>
          </div>
        </form>
      ) : (
        <p className="font-ui text-sm text-on-surface-variant mb-8">
          {t.rich("loginPrompt", {
            link: (chunks) => (
              <Link href="/login" className="text-primary">
                {chunks}
              </Link>
            ),
          })}
        </p>
      )}

      {loading ? (
        <CommentThreadSkeleton />
      ) : (
        <div className="space-y-6">
          {topLevel.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              childrenOf={childrenOf}
              onReply={postComment}
              onChanged={load}
              depth={0}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CommentNode({
  comment,
  childrenOf,
  onReply,
  onChanged,
  depth,
}: {
  comment: CommentDetail;
  childrenOf: (url: string) => CommentDetail[];
  onReply: (body: string, parent: string) => Promise<void>;
  onChanged: () => Promise<void>;
  depth: number;
}) {
  const { user } = useAuth();
  const t = useTranslations("Comments");
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.body);
  const [busy, setBusy] = useState(false);

  const isAuthor = user && usernameFromUserUrl(comment.author) === user.username;
  const children = childrenOf(comment.url);

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setBusy(true);
    try {
      await onReply(replyText.trim(), comment.url);
      setReplyText("");
      setReplying(false);
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async () => {
    setBusy(true);
    try {
      await apiFetch(comment.url, {
        method: "PATCH",
        body: JSON.stringify({ body: editText }),
      });
      setEditing(false);
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  const deleteComment = async () => {
    setBusy(true);
    try {
      await apiFetch(comment.url, { method: "DELETE" });
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={depth > 0 ? "ms-8 border-s-2 border-outline-variant ps-4" : "border-b border-outline-variant pb-4"}>
      <div className="flex justify-between items-start mb-2">
        <Link
          href={`/u/${usernameFromUserUrl(comment.author)}`}
          className="font-ui text-sm text-on-surface hover:text-primary"
        >
          @{usernameFromUserUrl(comment.author)}
        </Link>
        {isAuthor && !editing && (
          <div className="flex gap-3 text-on-surface-variant">
            <button onClick={() => setEditing(true)} className="text-xs hover:text-primary">
              {t("edit")}
            </button>
            <button onClick={deleteComment} disabled={busy} className="text-xs hover:text-error">
              {t("delete")}
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="flex flex-col gap-2 mb-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={2}
            className="w-full bg-transparent border border-outline-variant p-2 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={saveEdit}
              disabled={busy}
              className="text-xs font-ui text-primary"
            >
              {t("save")}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs font-ui text-on-surface-variant"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <p className="font-article text-sm text-on-surface mb-2">{comment.body}</p>
      )}

      <div className="flex items-center gap-4">
        <ReactionBar reactionsUrl={comment.reactions} compact />
        {user && (
          <button
            onClick={() => setReplying((r) => !r)}
            className="text-xs font-ui text-on-surface-variant hover:text-primary"
          >
            {t("reply")}
          </button>
        )}
      </div>

      {replying && (
        <form onSubmit={submitReply} className="mt-2 flex flex-col gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            placeholder={t("replyPlaceholder")}
            className="w-full bg-transparent border border-outline-variant p-2 resize-none text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="self-end text-xs font-ui bg-primary text-on-primary px-3 py-1.5 rounded"
          >
            {t("reply")}
          </button>
        </form>
      )}

      {children.length > 0 && (
        <div className="mt-4 space-y-4">
          {children.map((child) => (
            <CommentNode
              key={child.id}
              comment={child}
              childrenOf={childrenOf}
              onReply={onReply}
              onChanged={onChanged}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

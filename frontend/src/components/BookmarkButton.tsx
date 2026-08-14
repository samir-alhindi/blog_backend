"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { API_BASE_URL } from "@/lib/config";
import type { Bookmark, Paginated } from "@/lib/types";

export default function BookmarkButton({ postUrl }: { postUrl: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [bookmark, setBookmark] = useState<Bookmark | null | undefined>(
    undefined
  );
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setBookmark(null);
      return;
    }
    // GET /bookmarks/ already scopes to the current user, and (unlike every
    // other list endpoint) has no pagination_class set, so it's a plain array.
    // Guard both shapes so adding pagination upstream can't crash this again.
    const data = await apiFetch<Bookmark[] | Paginated<Bookmark>>(
      `${API_BASE_URL}/bookmarks/`
    );
    const list = Array.isArray(data) ? data : data?.results ?? [];
    setBookmark(list.find((b) => b.post === postUrl) ?? null);
  }, [user, postUrl]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (busy || bookmark === undefined) return;

    // Optimistic: fill/empty the icon immediately, then reconcile via load().
    const prev = bookmark;
    setBookmark(prev ? null : ({ url: "", post: postUrl } as Bookmark));
    setBusy(true);
    try {
      if (prev) {
        await apiFetch(prev.url, { method: "DELETE" });
      } else {
        await apiFetch(`${API_BASE_URL}/bookmarks/`, {
          method: "POST",
          body: JSON.stringify({ post: postUrl }),
        });
      }
      await load();
    } catch {
      setBookmark(prev); // roll back on failure
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      title={bookmark ? "Remove bookmark" : "Save for later"}
      className={`transition-colors disabled:opacity-50 ${
        bookmark ? "text-primary" : "text-on-surface-variant hover:text-primary"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={bookmark ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M6 3a1 1 0 0 0-1 1v17l7-4.5 7 4.5V4a1 1 0 0 0-1-1H6Z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

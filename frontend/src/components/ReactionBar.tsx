"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { REACTION_TYPES, type ReactionType, type Paginated, type PostReaction, type CommentReaction } from "@/lib/types";

const REACTION_EMOJI: Record<ReactionType, string> = {
  Like: "👍",
  Dislike: "👎",
  Funny: "😂",
  Sad: "😢",
  Angry: "😠",
  Scary: "👻",
};

type ReactionEntry = PostReaction | CommentReaction;

export default function ReactionBar({
  reactionsUrl,
  compact = false,
}: {
  reactionsUrl: string;
  compact?: boolean;
}) {
  const { user } = useAuth();
  const t = useTranslations("Reactions");
  const router = useRouter();
  const [reactions, setReactions] = useState<ReactionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    // The reaction list endpoint has no per-author filter, so we pull a
    // generous page and match the current user's reaction client-side.
    const data = await apiFetch<Paginated<ReactionEntry>>(
      `${reactionsUrl}?page_size=100`
    );
    // Defend against a missing/renamed envelope rather than assuming `.results`.
    setReactions(Array.isArray(data?.results) ? data.results : []);
    setLoading(false);
  }, [reactionsUrl]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = REACTION_TYPES.reduce<Record<ReactionType, number>>(
    (acc, type) => {
      acc[type] = reactions.filter((r) => r.reaction_type === type).length;
      return acc;
    },
    {} as Record<ReactionType, number>
  );

  const mine = user
    ? reactions.find((r) => r.author === user.url)
    : undefined;

  const handleClick = async (type: ReactionType) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (busy) return;

    // Optimistic update: reflect the click instantly, then reconcile with the
    // server (which hands back the real reaction URL used by future clicks).
    const prev = reactions;
    let optimistic: ReactionEntry[];
    if (mine && mine.reaction_type === type) {
      optimistic = reactions.filter((r) => r !== mine);
    } else if (mine) {
      optimistic = reactions.map((r) =>
        r === mine ? { ...r, reaction_type: type } : r
      );
    } else {
      optimistic = [
        ...reactions,
        { author: user.url, reaction_type: type } as ReactionEntry,
      ];
    }
    setReactions(optimistic);
    setBusy(true);
    try {
      if (mine && mine.reaction_type === type) {
        await apiFetch(mine.url, { method: "DELETE" });
      } else if (mine) {
        await apiFetch(mine.url, {
          method: "PATCH",
          body: JSON.stringify({ reaction_type: type }),
        });
      } else {
        await apiFetch(reactionsUrl, {
          method: "POST",
          body: JSON.stringify({ reaction_type: type }),
        });
      }
      await load();
    } catch {
      setReactions(prev); // roll back on failure
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="h-8" />;
  }

  return (
    <div
      className={`flex items-center flex-wrap ${compact ? "gap-1" : "gap-2"}`}
    >
      {REACTION_TYPES.map((type) => {
        const active = mine?.reaction_type === type;
        const count = counts[type];
        return (
          <button
            key={type}
            type="button"
            onClick={() => handleClick(type)}
            title={t(type)}
            className={`flex items-center gap-1 rounded-full font-ui transition-colors ${
              compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
            } ${
              active
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>{REACTION_EMOJI[type]}</span>
            {!compact && <span>{t(type)}</span>}
            {count > 0 && <span className="font-ui text-xs">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

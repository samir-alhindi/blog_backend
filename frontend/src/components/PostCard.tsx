import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { PostSummary } from "@/lib/types";
import { usernameFromUserUrl } from "@/lib/url-helpers";
import { formatDate } from "@/lib/date";
import BookmarkButton from "./BookmarkButton";

export default function PostCard({ post }: { post: PostSummary }) {
  const authorUsername = usernameFromUserUrl(post.author);

  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 flex flex-col gap-4 hover:shadow-[0_10px_30px_rgba(113,42,226,0.08)] transition-shadow">
      <div className="flex items-center gap-3">
        <Link
          href={`/u/${authorUsername}`}
          className="font-ui text-sm text-on-background hover:text-primary transition-colors"
        >
          @{authorUsername}
        </Link>
        <span className="font-ui text-xs text-on-surface-variant">
          {formatDate(post.creation_datetime)}
        </span>
      </div>

      {post.image && (
        <Link
          href={`/posts/${post.slug}`}
          className="block aspect-[21/9] rounded overflow-hidden bg-surface-container relative"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </Link>
      )}

      <Link href={`/posts/${post.slug}`}>
        <h2 className="font-display text-2xl text-on-background hover:text-primary transition-colors">
          {post.title}
        </h2>
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
        <div className="flex items-center gap-4 font-ui text-sm text-on-surface-variant">
          <span>👍 {post.reactions_count}</span>
          <span>💬 {post.comments_count}</span>
        </div>
        <BookmarkButton postUrl={post.url} />
      </div>
    </article>
  );
}

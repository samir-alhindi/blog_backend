/**
 * Loading skeletons that mirror the real content's layout, so pages settle
 * into place instead of flashing plain "Loading…" text. All blocks share the
 * same pulsing surface tone.
 */

function Block({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-surface-container-high rounded animate-pulse ${className}`}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Block className="h-4 w-24" />
        <Block className="h-3 w-16" />
      </div>
      <Block className="h-8 w-3/4" />
      <Block className="h-4 w-full" />
      <Block className="h-4 w-2/3" />
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
        <div className="flex gap-4">
          <Block className="h-4 w-10" />
          <Block className="h-4 w-10" />
        </div>
        <Block className="h-5 w-5" />
      </div>
    </div>
  );
}

export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto w-full px-margin-edge py-stack-lg">
      <Block className="h-10 w-4/5 mb-6" />
      <div className="flex items-center justify-between border-b border-outline-variant pb-6 mb-8">
        <div className="flex flex-col gap-2">
          <Block className="h-4 w-28" />
          <Block className="h-3 w-20" />
        </div>
        <Block className="h-9 w-24 rounded-full" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Block key={i} className={`h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-3xl mx-auto w-full px-margin-edge py-stack-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
        <Block className="w-32 h-32 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-3">
          <Block className="h-7 w-40" />
          <Block className="h-4 w-full max-w-md" />
          <div className="flex gap-6">
            <Block className="h-4 w-20" />
            <Block className="h-4 w-20" />
          </div>
        </div>
      </div>
      <PostListSkeleton count={2} />
    </div>
  );
}

export function FollowRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant p-4 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Block className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex flex-col gap-2">
              <Block className="h-4 w-28" />
              <Block className="h-3 w-40" />
            </div>
          </div>
          <Block className="h-9 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CommentThreadSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-b border-outline-variant pb-4 flex flex-col gap-2">
          <Block className="h-4 w-24" />
          <Block className="h-4 w-full" />
          <Block className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

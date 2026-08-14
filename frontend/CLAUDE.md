@AGENTS.md

# Always respond in English

Always reply to the user in English, even when they write in Arabic (or any
other language). This is a standing preference — do not switch languages.

# Folio — frontend for blog_backend

Next.js 16 (App Router, TypeScript, Tailwind v4) frontend for a friend's Django REST
Framework blog API (`~/Projects/blog_backend`, repo: samir-alhindi/blog_backend). The
API is hyperlinked (HATEOAS) and JWT-authenticated. Design source of truth is the
Stitch export in `stitch-exports/` (12 screens + `folio_aesthetic/DESIGN.md` — colors,
type, spacing tokens, all ported into `src/app/globals.css`'s `@theme` block).

## Running it locally

Backend (in `~/Projects/blog_backend`):
```
source .venv/bin/activate   # venv already created, deps already installed
python manage.py runserver 8000
```
Frontend (in `~/Projects/blog-frontend`):
```
npm run dev   # picks 3000 or next free port — check the terminal output
```
`.env.local` has `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api`. CORS is
regex-based (`CORS_ALLOWED_ORIGIN_REGEXES` in `blog_backend/settings.py`) and allows
any `localhost`/`127.0.0.1` port, so it doesn't matter which port `next dev` picks.

## Backend changes — merged into main

PR [#1](https://github.com/samir-alhindi/blog_backend/pull/1) was opened, then
squash-merged into `blog_backend`'s `main` (commit `097f091`) after Yousef confirmed
the repo owner (Samir) was fine with it. These are now live upstream, not local-only:
- `blog_backend/settings.py` — added `corsheaders` + `CORS_ALLOWED_ORIGIN_REGEXES`
  (allows any `localhost`/`127.0.0.1` port). **Required for the frontend to work at
  all** — without it every browser request is blocked cross-origin.
- `comments/serializers.py` — added `body` to `CommentListSerializer.Meta.fields`, so
  comment lists don't need a follow-up detail fetch per comment just to show text.
- `Pipfile` / `Pipfile.lock` — added `django-cors-headers`. Lock was regenerated
  against Python 3.14 (3.12, what the `Pipfile` declares, wasn't available in this
  environment) — functionally fine, just a bigger diff than a 3.12-locked version
  would've been.
- `.gitignore` — added `__pycache__/`, `*.pyc`, `.venv/`, `media/` (repo previously had
  no venv/pycache ignore rules; `media/` only affects *future* uploads — existing
  seed images stay tracked).

If you pull `blog_backend` fresh, these are already in `main` — no local patching
needed. `git pull` there before assuming your working copy is up to date.

## What's done

All 12 Stitch screens are built and wired to the real API (not mocked): Login, Sign
Up, Home Feed (sort by newest/most-reacted/most-discussed), Post Detail (all 6
reactions — Like/Dislike/Funny/Sad/Angry/Scary, threaded comments with reply/edit/
delete), Create/Edit Post, Profile (Posts/Comments tabs, follow button), Followers/
Following, Bookmarks, Trash (restore/delete permanently), Search (posts + writers),
Account Settings (profile/password/delete account), 404.

Shared building blocks: `lib/api.ts` (JWT client with auto-refresh-on-401),
`lib/auth-context.tsx`, `components/ReactionBar.tsx`, `PostCard.tsx`,
`FollowButton.tsx`, `BookmarkButton.tsx`, `CommentThread.tsx`, `PostForm.tsx`.

Everything above has been build-verified (`npm run build`, zero TS errors),
lint-verified (`npm run lint`, clean), and browser-tested end-to-end against the live
backend (real login, publish a post, edit it, switch reactions, post/reply to
comments, toggle bookmarks, soft-delete + restore from trash, search).

### API gotchas already discovered the hard way — don't re-learn these

- `/deleted-posts/` and `/bookmarks/` have **no `pagination_class`** set on the
  backend (every other list endpoint does) — they return a plain JSON array, not the
  usual `{count, next, previous, results}` envelope. `lib/types.ts` has a comment on
  `DeletedPost` about this; `BookmarkButton.tsx` was fixed after it shipped broken.
  If a new list endpoint is added on the backend, check this before assuming
  pagination.
- Comment `parent` is a **hyperlink** (`.../comments/5/`), not a raw integer ID, even
  though the model field is an FK — `HyperlinkedModelSerializer` auto-builds it that
  way since it's never explicitly overridden. Confirmed via direct curl, not just
  reading the serializer.
- `CommentListSerializer` didn't include `body` until the fix above — if this
  regresses, comment threads will render empty text.
- JWT login field is `username` (not `email`) — matches `USERNAME_FIELD` on the
  custom `User` model.
- Account creation (`POST /users/`) does a server-side session login but returns no
  JWT — `registerUser()` in `lib/api.ts` calls `login()` separately right after.

## What's left / known gaps to improve

Roughly in priority order:

1. **404 handling is inconsistent.** `posts/[slug]` catches a 404 and shows a friendly
   "not found" state. `u/[username]` and `write/[slug]` (edit) do not — an invalid
   username or slug currently just hangs on "Loading…" forever instead of showing
   the 404 page. Should reuse the same `ApiError` status-check pattern from
   `posts/[slug]/page.tsx`.
2. **No optimistic UI updates.** Reactions, follows, and bookmarks all wait for a
   refetch after every action instead of updating instantly and rolling back on
   error. Functionally correct but feels a beat slower than it should, especially on
   the reaction bar since it's the most-clicked thing on the page.
3. **List pages fetch everything with `page_size=100` and don't paginate further** —
   Search results, Followers/Following, Bookmarks, and the comment thread all do
   this. Fine at current (teaching-project) scale; will silently truncate at >100
   items. Worth adding real "load more" pagination if the friend's data grows.
4. **No loading skeletons** — every page shows plain "Loading…" text. Stitch designed
   nicer empty/loading states (see `empty_error_states_folio` in `stitch-exports/`)
   that were only partially implemented (empty feed, no bookmarks, no search
   results, 404 are done; a generic network-error/retry state is not).
5. **Race-condition robustness** — the bookmarks crash (see above) was found by
   actually reading server logs, not by code review. Worth a pass over
   `ReactionBar`/`FollowButton`/`CommentThread` for the same class of bug: any
   `apiFetch` call whose response shape is assumed rather than defended against.
6. **No rich text/markdown** in the post editor — plain `<textarea>`. Matches the
   Stitch mockup's plain writing surface, but there's no formatting at all, not even
   paragraphs beyond `white-space: pre-wrap`.
7. **Account deletion and password-change were visually confirmed but never actually
   submitted in a test** (didn't want to nuke the test account mid-session). Worth
   one real click-through before considering Settings done.
8. **Production readiness untouched** — backend still has `DEBUG = True`, the
   original insecure `SECRET_KEY`, empty `ALLOWED_HOSTS`, sqlite. Frontend has no
   deployment config, no production API URL handling beyond the one env var, no
   custom favicon/per-page metadata/sitemap. None of this matters for local dev but
   all of it matters before showing this to anyone else.
9. **Mobile responsiveness was never actually tested** in a resized/mobile viewport —
   Tailwind classes assume responsive behavior but nothing was verified below
   desktop width.

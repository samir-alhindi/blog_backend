# Folio — The Modern Atelier

A bilingual, fully-responsive blogging front end built with **Next.js 16** and **TypeScript**, wired to a live Django REST API. Folio is an editorial writing platform — publish, react, discuss, and follow — designed with the calm, considered feel of an artist's atelier.

> **Frontend** by Yousef Abdulaal · connects to the **`blog_backend`** Django REST API (by Samir Alhindi).

---

## Highlights

- **Bilingual, first-class Arabic** — full English 🇬🇧 / Arabic 🇸🇦 interface with **locale-prefixed routing** (`/en`, `/ar`), automatic **right-to-left (RTL)** layout mirroring, and dedicated Arabic typography (Amiri + IBM Plex Sans Arabic). Every string lives in reviewed translation catalogs — no hardcoded copy.
- **Real API, not mocked** — hyperlinked (HATEOAS) Django REST backend with **JWT auth and silent token refresh** on `401`.
- **Considered UX** — optimistic UI on reactions/follows/bookmarks (with rollback on failure), loading skeletons, toast notifications, confirmation dialogs for destructive actions, and friendly empty / 404 states.
- **Rich authoring** — Markdown rendering with live preview, and a client-side **image cropper** (cover images and avatars) so what you frame is what gets stored.
- **Accessible & responsive** — keyboard-focus states, reduced-motion support, and an Instagram-style bottom tab bar on mobile.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (design tokens in `globals.css`) |
| i18n | `next-intl` (locale routing + RTL) |
| Content | `react-markdown` + `remark-gfm`, `react-easy-crop` |
| Auth | JWT (access/refresh) against Django REST Framework |

---

## Features

**Reading & discovery**
- Home feed with sort by newest / most reacted / most discussed, and "load more" pagination
- Full-text search across posts and writers
- Post detail with cover image, Markdown body, and threaded comments

**Engagement**
- Six reactions (Like, Dislike, Funny, Sad, Angry, Scary) on posts *and* comments
- Threaded comments with reply, edit, and delete
- Follow / unfollow writers; followers & following lists
- Bookmarks (save for later)

**Authoring & account**
- Create / edit posts with Markdown + preview and a cover-image cropper
- Trash with restore and permanent delete
- Profile with Posts / Comments tabs
- A settings hub: profile, security (password), language preference, session (log out), and account deletion — each with clear feedback

---

## Project structure

```
src/
├── app/
│   ├── [locale]/            # every route, localized (/en, /ar)
│   │   ├── layout.tsx        # <html lang dir>, fonts, providers
│   │   ├── page.tsx          # home feed
│   │   ├── posts/[slug]/     # post detail
│   │   ├── write/            # create / edit
│   │   ├── u/[username]/     # profile, followers, following
│   │   ├── search/ settings/ bookmarks/ trash/ login/ signup/
│   │   └── not-found.tsx
│   └── globals.css           # Tailwind theme tokens + RTL font swap
├── components/               # ReactionBar, CommentThread, PostForm,
│                             # ImageCropModal, ConfirmDialog, nav, skeletons…
├── i18n/                     # next-intl routing / navigation / request config
├── lib/                      # api client, auth context, toast, helpers
├── proxy.ts                  # next-intl middleware (Next 16 "proxy" convention)
messages/
├── en.json                   # source-of-truth UI strings
└── ar.json                   # Arabic translations
```

---

## Getting started

**Prerequisites:** Node.js 20+, and the `blog_backend` API running locally (Django, port 8000).

```bash
# 1. Install dependencies
npm install

# 2. Configure the API base URL
#    create .env.local and set NEXT_PUBLIC_API_BASE_URL (see below)

# 3. Run the dev server
npm run dev
```

Open the port shown in the terminal (defaults to `http://localhost:3000`, or the next free port).

### Environment

Create a `.env.local` file (never commit it — it is git-ignored):

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the Django REST API (e.g. `http://localhost:8000/api`) |
| `NEXT_PUBLIC_SITE_URL` | *(optional)* Canonical site URL for metadata / Open Graph |

> The frontend holds no server secrets; JWTs live in the browser at runtime only.

### Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

---

## Notable engineering decisions

- **Locale-prefixed routing over cookies** — every language has a shareable, SEO-distinct URL; the whole app lives under `app/[locale]/`.
- **Defensive API layer** — the client tolerates both paginated envelopes and bare arrays, refreshes expired tokens transparently, and surfaces typed `ApiError`s.
- **Optimistic, reversible interactions** — reactions/follows/bookmarks update instantly and roll back if the request fails, so the UI never feels laggy.
- **Design tokens** — colors, type roles, and spacing are defined once in `globals.css`; Arabic swaps the typeface set via a single `html[lang="ar"]` rule.

---

## Credits

- **Frontend** — Yousef Abdulaal
- **Backend API** (`blog_backend`, Django REST Framework) — Samir Alhindi

Built as a collaborative project: a production-quality front end for a friend's blog API.

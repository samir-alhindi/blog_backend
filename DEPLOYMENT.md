# Deployment

Folio is a two-part app: a **Next.js frontend** (deploys to Vercel) and a
**Django REST backend** (`blog_backend`, Samir's repo). For the app to actually
work in production, **both** must be live and the frontend must point at the
public backend URL.

---

## 1. Frontend — Vercel ✅ (done)

The frontend is deployed:

- **Live:** <https://blog-frontend-olive-xi.vercel.app>
- **Project:** `blog-frontend` (Vercel account `jdf55`)
- Redeploy anytime with `vercel deploy --prod` from the project folder.

### Finish wiring it (once the backend is public)

1. In **Vercel → Project → Settings → Environment Variables**, set:
   - `NEXT_PUBLIC_API_BASE_URL = https://<your-backend-domain>/api`
   - `NEXT_PUBLIC_SITE_URL = https://blog-frontend-olive-xi.vercel.app`
2. In `next.config.ts`, add the backend's host to `images.remotePatterns`
   (so post covers and avatars load in production).
3. Redeploy.

> Until then, the site shows the full UI, but API-backed actions (login, feed,
> posting) won't work — there is no public backend yet.

---

## 2. Backend — Django (to do, with Samir)

The backend currently only runs locally and is **not production-ready**. It must
be hardened and hosted before the app works online. Because it's Samir's repo,
do the changes as a **Pull Request he approves** (as with the earlier CORS PR).

### 2a. Harden `settings.py`

| Setting | Change |
| --- | --- |
| `DEBUG` | `False` |
| `SECRET_KEY` | Load from an env var; generate a **new** secret and never commit it |
| `ALLOWED_HOSTS` | `[ "<backend-domain>" ]` |
| `CSRF_TRUSTED_ORIGINS` | `[ "https://blog-frontend-olive-xi.vercel.app" ]` |
| CORS | Add the Vercel domain to the allowed origins (today the regex only allows localhost) |
| Database | Switch **SQLite → PostgreSQL** (e.g. `dj-database-url` + `DATABASE_URL`) |
| Static files | Serve via **WhiteNoise** (`collectstatic` on deploy) |
| Media (uploads) | Move to object storage — **Cloudinary** or **S3** — because host filesystems are ephemeral and would lose uploaded images |
| HTTPS hardening | `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS`, secure cookies |

### 2b. Host it

Django + a database is a poor fit for Vercel; use a platform built for it:

- **App host:** Render, Railway, or Fly.io (all run Django + gunicorn well).
- **Database:** managed Postgres (Render Postgres, Neon, or Supabase).
- **Media:** Cloudinary (simple free tier) or AWS S3.

**Example (Render):**

1. Create a **PostgreSQL** instance → copy its `DATABASE_URL`.
2. Create a **Web Service** from `samir-alhindi/blog_backend`, root directory
   `backend/`.
   - Build: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
   - Start: `gunicorn <project>.wsgi`
3. Set env vars: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `DATABASE_URL`,
   Cloudinary/S3 creds, and the CORS/CSRF origin.
4. Create an admin user: `python manage.py createsuperuser`.

### 2c. Connect the two

Once the backend has a public URL, do **Frontend step "Finish wiring it"** above.

---

## Ownership & cost

- The backend is **Samir's** — hardening, secrets, database, and hosting are a
  joint decision. Coordinate before deploying it.
- A working full-stack deploy has small ongoing costs (database + media storage
  usually have free tiers, but plan for it).

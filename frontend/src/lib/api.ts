import { API_BASE_URL } from "./config";

const TOKENS_KEY = "folio_tokens";
const USERNAME_KEY = "folio_username";

interface Tokens {
  access: string;
  refresh: string;
}

export function getTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(TOKENS_KEY);
  return raw ? (JSON.parse(raw) as Tokens) : null;
}

function setTokens(tokens: Tokens) {
  window.localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function getStoredUsername(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USERNAME_KEY);
}

function setStoredUsername(username: string) {
  window.localStorage.setItem(USERNAME_KEY, username);
}

export function clearSession() {
  window.localStorage.removeItem(TOKENS_KEY);
  window.localStorage.removeItem(USERNAME_KEY);
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(
      typeof body === "string"
        ? body
        : `Request failed with status ${status}`
    );
    this.status = status;
    this.body = body;
  }
}

function resolveUrl(input: string): string {
  return input.startsWith("http") ? input : `${API_BASE_URL}${input}`;
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens) return null;
  const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!res.ok) {
    clearSession();
    return null;
  }
  const data = await res.json();
  setTokens({ access: data.access, refresh: tokens.refresh });
  return data.access as string;
}

interface ApiFetchOptions extends RequestInit {
  /** Attach the Authorization header when a session exists. Defaults to true. */
  auth?: boolean;
}

/**
 * Fetch wrapper for the Folio API. `input` may be a path relative to
 * API_BASE_URL (e.g. "/posts/") or a full hyperlink returned by a previous
 * API response (this is a HATEOAS API — most relations are links, not IDs).
 */
export async function apiFetch<T>(
  input: string,
  { auth = true, headers, ...init }: ApiFetchOptions = {}
): Promise<T> {
  const url = resolveUrl(input);
  const tokens = auth ? getTokens() : null;

  const doFetch = (accessToken: string | null) =>
    fetch(url, {
      ...init,
      headers: {
        ...(init.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    });

  let res = await doFetch(tokens?.access ?? null);

  if (res.status === 401 && tokens) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      res = await doFetch(newAccess);
    }
  }

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // no JSON body
    }
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export async function login(username: string, password: string) {
  const tokens = await apiFetch<Tokens>("/token/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    auth: false,
  });
  setTokens(tokens);
  setStoredUsername(username);
  return tokens;
}

export async function registerUser(fields: {
  username: string;
  password: string;
  bio?: string;
  avatar?: File | null;
}) {
  const form = new FormData();
  form.append("username", fields.username);
  form.append("password", fields.password);
  if (fields.bio) form.append("bio", fields.bio);
  if (fields.avatar) form.append("avatar", fields.avatar);

  await apiFetch("/users/", {
    method: "POST",
    body: form,
    auth: false,
  });

  // Account creation doesn't return JWTs (it only performs a session login
  // server-side), so we log in separately to get access/refresh tokens.
  return login(fields.username, fields.password);
}

export function logout() {
  clearSession();
}

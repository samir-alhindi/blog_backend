export type ReactionType = "Like" | "Dislike" | "Funny" | "Sad" | "Angry" | "Scary";

export const REACTION_TYPES: ReactionType[] = [
  "Like",
  "Dislike",
  "Funny",
  "Sad",
  "Angry",
  "Scary",
];

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// `author`, `post`, `comments`, `reactions`, `followers`, `following` etc.
// are hyperlinks (full URLs) returned by the API, not raw IDs — this is a
// HATEOAS API, so we follow the links it gives us rather than building URLs
// by hand wherever possible.

export interface User {
  url: string;
  id: number;
  username: string;
  bio: string;
  avatar: string | null;
  posts: string;
  comments: string;
  followers_count: number;
  following_count: number;
  followers: string;
  following: string;
}

export interface PostSummary {
  url: string;
  id: number;
  title: string;
  slug: string;
  image: string | null;
  author: string;
  creation_datetime: string;
  comments_count: number;
  bookmarks_count: number;
  reactions_count: number;
  comments: string;
  reactions: string;
  deletion_datetime: string | null;
}

export interface PostDetail extends PostSummary {
  body: string;
  last_edit_datetime: string;
}

export interface PostReaction {
  url: string;
  author: string;
  reaction_type: ReactionType;
  post: string;
  creation_datetime: string;
}

export interface CommentSummary {
  url: string;
  id: number;
  post: string;
  /** Hyperlink to the parent comment's detail endpoint, or null for a top-level comment. */
  parent: string | null;
  author: string;
  creation_datetime: string;
  reactions_count: number;
  replies_count: number;
  reactions: string;
  replies: string;
}

// The comment list endpoint (/comments/) does not include `body` — only the
// detail endpoint does. Rendering comment text always requires a follow-up
// fetch to each comment's `url`.
export interface CommentDetail extends CommentSummary {
  body: string;
  last_edit_datetime: string;
}

// /deleted-posts/ has no pagination_class set (unlike every other list
// endpoint), so it returns a plain array, not a Paginated<T> envelope.
export interface DeletedPost {
  url: string;
  id: number;
  title: string;
  slug: string;
  image: string | null;
  author: string;
  creation_datetime: string;
  comments_count: number;
  bookmarks_count: number;
  reactions_count: number;
  deletion_datetime: string;
}

export interface CommentReaction {
  url: string;
  author: string;
  reaction_type: ReactionType;
  creation_datetime: string;
  comment: number;
}

export interface Follow {
  url: string;
  id: number;
  from_user: string;
  to_user: string;
  creation_date: string;
}

export interface Bookmark {
  url: string;
  id: number;
  creation_date: string;
  post: string;
  user: string;
}

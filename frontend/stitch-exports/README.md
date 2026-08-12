# Stitch exports

Drop everything Stitch gives you for each screen in here, one subfolder per screen, e.g.:

```
stitch-exports/
  01-login/
  02-signup/
  03-home-feed/
  04-post-detail/
  05-create-edit-post/
  06-user-profile/
  07-edit-profile/
  08-followers-following/
  09-bookmarks/
  10-deleted-posts/
  11-search-explore/
  12-empty-error-states/
```

For each screen, include whatever Stitch lets you export — any of these work:
- Screenshot/PNG of the design
- Exported HTML/CSS (if Stitch gives you code)
- The Stitch share link (paste it in a `link.txt` file) if you'd rather not download files

Once these are in place, tell Claude to review the folder — it'll check each screen against the API's actual capabilities (fields, actions, permissions), flag anything missing or mismatched, and draft prompts for any additional screens or fixes needed.

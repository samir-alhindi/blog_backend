import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware replacements for next/link + next/navigation. Import Link,
// useRouter, usePathname, redirect from here (not from "next/*") so the current
// locale prefix is preserved automatically.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

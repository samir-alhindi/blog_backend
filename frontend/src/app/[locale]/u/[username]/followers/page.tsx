"use client";

import { use } from "react";
import FollowListPage from "@/components/FollowListPage";

export default function FollowersPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  return <FollowListPage username={username} direction="followers" />;
}

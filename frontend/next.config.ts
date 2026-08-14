import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 blocks the image optimizer from fetching local IPs
    // (localhost/127.0.0.1) by default — it returns 400 "url parameter is not
    // allowed", which renders every backend image (covers + avatars) blank in
    // local dev where the Django backend lives on localhost:8000. Enable the
    // escape hatch in dev only; in production the backend is a real host, so we
    // keep the SSRF protection on. See Next 16 upgrade guide → "Local IP
    // Restriction".
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/api/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/api/media/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export is for `next build` / Cloudflare Pages. Leaving it on
  // during `next dev` prevents client hydration in this environment.
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

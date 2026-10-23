import type { NextConfig } from "next";

const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/Gnose" : "";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : "standalone",
  basePath,
  trailingSlash: isGitHubPages,
  images: { unoptimized: isGitHubPages },
  reactStrictMode: true,
};

export default nextConfig;

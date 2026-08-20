import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const accountName = process.env.GITHUB_REPOSITORY?.split("/")[0] ?? "";
const basePath = isGitHubPages && repositoryName !== `${accountName}.github.io`
  ? `/${repositoryName}`
  : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;

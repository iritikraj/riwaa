import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",

  serverExternalPackages: [
    "puppeteer",
    "puppeteer-extra",
    "puppeteer-extra-plugin-stealth",
    "crawlee",
    "got-scraping",
    "header-generator",
    // "@remotion/renderer",
    // "@remotion/bundler",
  ],
};

export default nextConfig;
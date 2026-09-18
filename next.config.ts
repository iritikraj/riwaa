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
    "@resvg/resvg-js",
    "satori",
    "harfbuzzjs",
    "yoga-wasm-web",
    "nodemailer",
    // "@remotion/renderer",
    // "@remotion/bundler",
  ],
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeps the dev badge clear of the bottom-left corner (the market's mockup switch).
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;

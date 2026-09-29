import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bottom-left is taken by the V1/V2 switch.
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;

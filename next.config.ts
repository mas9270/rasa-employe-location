import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // ارورهای TS رو در زمان build نادیده می‌گیره
  },
  eslint: {
    ignoreDuringBuilds: true, // ارورهای ESLint رو نادیده می‌گیره
  }
};

export default nextConfig;

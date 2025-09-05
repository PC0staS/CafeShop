import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "upload.wikimedia.org",
      "pub-xxxxxxxx.r2.dev", 
    ],
  },
  experimental: {
    viewTransition: true,
  }
};

export default nextConfig;

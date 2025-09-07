import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "upload.wikimedia.org",
      "pub-xxxxxxxx.r2.dev",
      "images.unsplash.com",
      "cloudinary-marketing-res.cloudinary.com"
    ],
  },
  experimental: {
    viewTransition: true,
  }
};

export default nextConfig;

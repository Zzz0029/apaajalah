import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["images.unsplash.com", "ymofaixzuitajngdcevk.supabase.co"],
  },
};

export default nextConfig;

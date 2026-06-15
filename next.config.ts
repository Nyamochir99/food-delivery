import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/kfcsort/:path*",
        destination:
          "https://z4ryw4kny0.execute-api.ap-southeast-1.amazonaws.com/production//:path*",
      },
    ];
  },
};

export default nextConfig;

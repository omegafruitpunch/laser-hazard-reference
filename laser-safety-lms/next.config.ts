import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {},
  
  // Allow iframe embedding from same origin (for Streamlit integration)
  // Note: In production, you may want to restrict this to specific origins
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' http://localhost:* https://localhost:*;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

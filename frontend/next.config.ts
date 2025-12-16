import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    // Allow Server Actions from forwarded requests (dev tunnels)
    serverActions: {
      allowedOrigins: [
        "localhost:3001",
        "*.devtunnels.ms",
        "*.asse.devtunnels.ms",
      ],
    },
  },
  // Suppress hydration warnings caused by browser extensions (like Grammarly)
  reactStrictMode: true,

  // Proxy GraphQL requests to avoid CORS issues in development
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: "http://localhost:3000/graphql",
      },
    ];
  },
};

export default nextConfig;

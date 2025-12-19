const nextConfig = {
  experimental: {
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false,
};

export default nextConfig as any;

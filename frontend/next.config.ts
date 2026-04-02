const nextConfig = {
  // Use a different output directory for dev to prevent deleting production build
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
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
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig as any;

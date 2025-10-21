const nextConfig = {
  // Explicitly set turbopack root to this project folder to avoid
  // the multi-lockfile auto-detection warning in monorepo-like layouts.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;

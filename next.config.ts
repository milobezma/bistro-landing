import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // URLs del sitio estático anterior (anuncios, buscadores, links guardados).
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/gracias.html", destination: "/gracias", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

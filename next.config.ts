import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Generación estática más lenta pero amable con el límite de la API de Rick and Morty
    staticGenerationMaxConcurrency: 3, // páginas en paralelo por worker
    staticGenerationRetryCount: 3, // reintentos por página antes de fallar el build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
      },
    ],
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

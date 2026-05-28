import type { NextConfig } from "next";

const backendUrl= process.env.NEXT_PUBLIC_BACKEND_URL;

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: backendUrl? new URL(backendUrl).hostname: 'localhost',
        port: backendUrl ? new URL(backendUrl).port: "8082",
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

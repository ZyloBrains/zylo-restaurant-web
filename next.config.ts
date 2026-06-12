import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8082";

const backend = new URL(backendUrl);

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: backend.protocol.replace(":", "") as "http" | "https",
        hostname: backend.hostname,
        port: backend.port || "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
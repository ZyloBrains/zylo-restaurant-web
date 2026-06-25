import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8082/api/v1/";

const backend = new URL(backendUrl);

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  devIndicators: false,
  allowedDevOrigins:[
    "fish-station.zylobrains.com",
    "another-tenant.zylobrains.com",
    "www.customclient.com",       // ← specific, not www.**  (invalid)
    "*.zylobrains.com",
  ],

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
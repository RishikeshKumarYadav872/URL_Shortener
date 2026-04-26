import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Prisma works correctly on Vercel
  serverExternalPackages: ["pg"],
};

export default nextConfig;

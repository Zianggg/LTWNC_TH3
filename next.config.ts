import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // shadcn import từ gói gộp "radix-ui"; chỉ đưa vào bundle những phần thực sự dùng.
    optimizePackageImports: ["radix-ui"],
  },
};

export default nextConfig;

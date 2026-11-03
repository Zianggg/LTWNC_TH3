import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dữ liệu JSON và font của ảnh OG được đọc bằng fs lúc chạy: phải kèm vào gói serverless trên Vercel.
  outputFileTracingIncludes: {
    "/**": ["./data/**/*", "./assets/fonts/**/*"],
  },
  experimental: {
    // shadcn import từ gói gộp "radix-ui"; chỉ đưa vào bundle những phần thực sự dùng.
    optimizePackageImports: ["radix-ui"],
  },
};

export default nextConfig;

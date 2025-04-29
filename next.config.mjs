/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Giữ nguyên, nhưng cân nhắc tắt khi production
  },
  // Bật SWC minify để giảm kích thước JavaScript
  swcMinify: true,

  // Tăng hiệu suất với experimental features
  experimental: {
    // Sử dụng SWC compiler để build nhanh hơn
    swcMinify: true,
  },
};

export default nextConfig;

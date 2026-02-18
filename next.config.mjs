/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }, { protocol: 'http', hostname: '**' }],
  },
  // Optional: static export if you prefer static hosting
  // output: 'export',
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/*',
      },
    ],
  },
    webpack: (config) => {
      config.externals = [...config.externals, { canvas: 'canvas' }];
      return config;
  },
};

export default nextConfig;

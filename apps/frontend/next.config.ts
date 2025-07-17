import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@calmpulse-app/types', '@calmpulse-app/ts-rest', '@calmpulse-app/utils'],
  webpack(config) {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
      '.jsx': ['.jsx', '.tsx'],
    };
    return config;
  },
};

export default nextConfig;

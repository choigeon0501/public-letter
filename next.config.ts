import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    /** 유튜브 썸네일(랜딩 영상 미리보기) */
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com' }],
  },
};

export default nextConfig;

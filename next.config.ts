import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next 16 takes an exclusive lock on the dist dir and refuses to start a
    // second `next dev` for the same project directory. Disabled so a preview
    // server can run alongside another chat's dev server on this checkout.
    lockDistDir: false,
  },
};

export default nextConfig;

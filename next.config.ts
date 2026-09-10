import type { NextConfig } from "next";

process.env.TZ = process.env.APP_TIMEZONE ?? "America/Sao_Paulo";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // CLAUDE.md e mantido a mao — o Next nao deve gerar/sobrescrever.
  agentRules: false,
  images: {
    // Banners de jogos vem da CDN da Steam.
    remotePatterns: [
      { protocol: "https", hostname: "shared.akamai.steamstatic.com" },
      { protocol: "https", hostname: "shared.fastly.steamstatic.com" },
      { protocol: "https", hostname: "cdn.akamai.steamstatic.com" },
      { protocol: "https", hostname: "cdn.cloudflare.steamstatic.com" },
      { protocol: "https", hostname: "steamcdn-a.akamaihd.net" },
    ],
  },
};

export default nextConfig;

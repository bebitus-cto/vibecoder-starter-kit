import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 모노레포 루트를 명시 (상위 폴더에 다른 lockfile 이 있어도 헷갈리지 않게)
  outputFileTracingRoot: join(dirname(fileURLToPath(import.meta.url)), "../.."),
  // 밀키트 재료(packages/*)는 TypeScript 소스 그대로 가져다 쓴다 — Next가 대신 컴파일
  transpilePackages: [
    "@vibe-kit/supabase",
    "@vibe-kit/ai",
    "@vibe-kit/cloudflare",
    "@vibe-kit/google-sheets",
    "@vibe-kit/ui",
  ],
};

export default nextConfig;

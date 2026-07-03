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
  // .env 키 이름은 SUPABASE_URL / SUPABASE_ANON_KEY (NEXT_PUBLIC_ 접두사 없이).
  // 브라우저에서도 읽히도록 여기서 실어준다. 어느 이름으로 적어도(신·구) 둘 다 동작.
  // anon 키는 공개 전제 키라 브라우저 노출이 정상 — 마스터 키(SERVICE_ROLE)는 절대 여기 넣지 않는다.
  env: {
    SUPABASE_URL:
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "",
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "",
  },
};

export default nextConfig;

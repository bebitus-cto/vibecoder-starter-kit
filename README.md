# vibe-kit — 바이브코딩 밀키트

> 재료는 다 깔려 있다. 당신은 **아이디어만 얹으면** 된다.
> 요리 밀키트처럼 — 손질된 재료(외부 서비스 연결)와 조리도구(설정·훅·기획 스킬)가 준비돼 있고, 당신은 조립만 한다.

## 쓰는 법 3가지

### A. 새 프로젝트로 시작 (clone)
```bash
git clone https://github.com/bebituslab/bebitus-vibe-kit my-project
cd my-project
node scripts/setup.mjs        # 도구 점검 (없는 것 알려줌)
pnpm install                  # 재료 하이드레이트
cp .env.example .env          # 열쇠 보관함 만들기 (처음엔 더미 그대로 OK)
pnpm dev                      # http://localhost:3000 — 첫 화면이 뜬다
```
그 다음 클로드 코드를 켜고: **"기획하자"** (blueprint 스킬이 8단계 질문으로 설계도를 뽑아준다) → **"plan.md 대로 첫 블럭 만들어줘"**.

### B. 이미 진행 중인 프로젝트에 얹기 (adopt)
내 프로젝트를 갈아엎지 않고, 밀키트의 부품만 골라 주입한다:
```bash
# vibe-kit 폴더에서 실행 (--dry 로 미리보기 먼저)
node scripts/adopt.mjs --into ../내프로젝트 --dry
node scripts/adopt.mjs --into ../내프로젝트                       # 기본: claude,env,plan
node scripts/adopt.mjs --into ../내프로젝트 --parts claude,env,plan,integrations,e2e
```
- 기존 파일은 **절대 덮지 않는다** (건너뛰고 알려줌 · 덮으려면 `--force`)
- `settings.json` 은 통째 교체가 아니라 **훅 항목만 병합**
- 대상의 `.env` 는 **절대 건드리지 않는다**

### C. 부품 하나만 집어오기 (degit)
```bash
npx degit bebituslab/bebitus-vibe-kit/packages/integrations/supabase lib/supabase
```

## 뭐가 들어있나
```
apps/web             웹앱 (Next.js) — pnpm dev 하면 바로 뜸        "화면이 웹이면 여기"
apps/mobile          모바일앱 (Expo) — 선택 재료(아래 참고)          "앱스토어에 낼 거면 여기"
packages/integrations/
  supabase           DB + 로그인 (실동작 — 키만 넣으면 바로)        제일 많이 씀
  ai                 AI 두뇌 (실동작 — Claude 연결됨)
  cloudflare         배포·엣지·파일저장 (냉동칸 — 활성화 1줄)
  google-sheets      시트를 DB처럼 (냉동칸 — 활성화 1줄)
packages/ui          공유 UI 자리 (shadcn 부품은 여기 또는 apps/web)
e2e                  Playwright — 자동 손님이 클릭 테스트
scripts/setup.mjs    도구(CLI) 점검·설치 안내
scripts/adopt.mjs    기존 프로젝트에 부품 주입
.claude/
  CLAUDE.md          클로드에게 주는 조언 (비개발자 배려·plan.md 우선)
  settings.json      훅 연결
  hooks/*.mjs        훅 4종 (node — jq·python 없이 어디서나 돔)
  skills/blueprint   기획 인터뷰 스킬 (PRD·기능명세서·유저플로우·와이어프레임·DB 설계)
plan.md              내 기획서 (blueprint 가 채움 · progress 훅이 읽음)
.env.example         열쇠 보관함 견본 (바이브코더 상용 플랫폼 키 전부)
```

## 기획부터 시작 (권장 흐름)
1. 클로드 코드에서 **"기획하자"** → blueprint 스킬이 8단계로 아주 자세히 묻는다 (아이디어→타겟→MVP 3개→유저플로우→화면→**DB 구조**→외부연동·키→운영).
2. 끝나면 `docs/plan/` 에 PRD·기능명세서·유저플로우·와이어프레임·DB 설계가 생기고 `plan.md` 가 채워진다.
3. **"1번 블럭 만들어줘"** — 한 번에 한 블럭씩. 훅이 localhost 를 자동으로 열어준다.

## 모바일(Expo)은 선택 재료
설치 용량이 커서 기본은 꺼져 있다. 쓰려면:
1. `pnpm-workspace.yaml` 에서 `# - "apps/mobile"` 주석 해제
2. `pnpm install` → `pnpm dev:mobile`

## 열쇠(.env) 규칙 — 꼭 읽기
- `.env` 는 **절대 깃허브에 올리지 않는다** (.gitignore 로 차단됨)
- 처음엔 전부 더미로 두고 화면부터. 진짜 키는 나중에 채워도 됨 — 코드가 "키 없음"을 친절히 알려준다
- 결제 키는 **반드시 테스트 키부터** (실키 전환은 오픈 직전 맨 마지막)

## 이 키트를 깃허브에 올리기 (키트 관리자용)
```bash
cd vibe-kit
git init -b main && git add -A && git commit -m "bebitus-vibe-kit v2"
gh repo create bebitus-vibe-kit --public --source . --push     # 또는 깃허브에서 레포 만들고 remote 연결
```

## 자세히
- 재료·오픈소스 활용법 → [docs/INGREDIENTS.md](docs/INGREDIENTS.md)
- 프로젝트 안 훅 설명 → [docs/HOOKS.md](docs/HOOKS.md)

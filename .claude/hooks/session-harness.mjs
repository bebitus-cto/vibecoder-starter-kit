#!/usr/bin/env node
// 훅 ⑤ 마무리 하네스 (Stop · 작업 구간이 끝날 때)
// 무엇: 이번 구간에 실제 코드 변경이 있었으면, 클로드에게 "구현 요약 → done-check 검증 →
//       plan.md 갱신·검증 로그 → 다음 블럭 추천 1개"를 이어서 하게 만든다(decision: block).
// 왜 훅인가: 판단(뭐가 됐나·다음은 뭐가 좋나)은 클로드가 하고, "그걸 반드시 하게 만드는 것"만
//       스크립트가 강제한다. 플러그인 불필요 — 프로젝트 훅으로 충분.
//
// 발동 조건(전부 만족할 때만):
//   plan.md 존재 · 작업 서명(git 상태+plan.md)이 지난 발동 때와 다름 · 쿨다운(10분) 경과
// 끄는 법: plan.md 아무 곳에 `harness: off` 한 줄.
// 보안: .env 안 읽음. Fail-open: 어떤 에러든 조용히 통과.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";

const COOLDOWN_MS = 10 * 60 * 1000; // 한 블럭 작업 단위(~10분)마다 최대 1회 — 매 턴 발동 방지

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", () => resolve(""));
  });
}

function sh(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, stdio: ["ignore", "pipe", "ignore"], timeout: 4000 }).toString();
  } catch {
    return "";
  }
}

try {
  const input = JSON.parse((await readStdin()) || "{}");
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const planPath = join(root, "plan.md");
  const statePath = join(root, ".claude", ".harness-state.json");

  if (existsSync(planPath) === false) process.exit(0);
  const plan = readFileSync(planPath, "utf8");
  if (plan.includes("harness: off")) process.exit(0);

  // 작업 서명: git 상태(변경 파일 목록+HEAD) + plan.md 내용.
  // git 이 없으면(수강생이 init 안 함) 소스 폴더의 최신 수정시각으로 코드 변경을 감지한다.
  const gitSig = sh("git status --porcelain", root) + sh("git rev-parse HEAD", root);
  let fileSig = "";
  if (gitSig.trim() === "") {
    try {
      const { readdirSync, statSync } = await import("node:fs");
      let maxM = 0;
      let count = 0;
      for (const dir of ["apps", "src", "app", "packages"]) {
        const base = join(root, dir);
        if (existsSync(base) === false) continue;
        for (const f of readdirSync(base, { recursive: true })) {
          const p = String(f);
          if (p.includes("node_modules") || p.includes(".next")) continue;
          count += 1;
          if (count > 3000) break; // 폭주 방지
          try {
            const m = statSync(join(base, p)).mtimeMs;
            if (m > maxM) maxM = m;
          } catch {}
        }
      }
      fileSig = String(maxM) + ":" + String(count);
    } catch {
      fileSig = "";
    }
  }
  const sig = createHash("sha256").update(gitSig + fileSig + plan).digest("hex").slice(0, 16);

  let state = {};
  try {
    state = JSON.parse(readFileSync(statePath, "utf8"));
  } catch {
    state = {};
  }

  const saveState = () => {
    try {
      writeFileSync(statePath, JSON.stringify({ lastSig: sig, lastFiredAt: state.lastFiredAt ?? 0 }));
    } catch {}
  };

  // 하네스가 시킨 이어가기가 끝난 Stop: 발동 금지 + 그 결과(plan.md 갱신 등)를 서명에 반영
  if (input.stop_hook_active === true) {
    saveState();
    process.exit(0);
  }

  const changed = state.lastSig !== sig;
  const hasWork = gitSig.trim() !== "" || changed; // git 더러움 또는 서명 변화 = 이번 구간에 일이 있었다
  const cooled = Date.now() - (state.lastFiredAt ?? 0) > COOLDOWN_MS;

  if (changed && hasWork && cooled) {
    try {
      writeFileSync(statePath, JSON.stringify({ lastSig: sig, lastFiredAt: Date.now() }));
    } catch {}
    process.stdout.write(
      JSON.stringify({
        decision: "block",
        reason:
          "[마무리 하네스] 작업 구간이 하나 끝났다. 사용자 눈높이로, 간결하게 4가지를 순서대로 하라: " +
          "① 이번 구간에 구현·변경된 것을 3줄 이내로 요약 " +
          "② done-check 스킬의 5문항 게이트로 실제 검증하고 마지막 줄에 '완료 판정: 통과/실패' 출력 " +
          "③ plan.md 체크박스를 실제 상태에 맞게 갱신하고(이미 맞으면 그대로 둔다), 문서 하단 '## 검증 로그'에 한 줄 기록(날짜 · 대상 · 판정) " +
          "④ 판정이 통과면 다음 블럭 1개만 추천(이유 한 줄), 실패면 다음 블럭 대신 지금 고칠 것 1개를 제시. " +
          "참고: done-check 의 '판정 줄로 끝내기'는 ②까지에만 적용된다. ③④는 판정 줄 뒤에 부록으로 이어라. " +
          "이 지시는 이 작업 구간에 1회다. 새 기능을 만들지 말고 정리·검증·추천만 하라.",
      })
    );
    process.exit(0);
  }

  saveState();
  process.exit(0);
} catch {
  process.exit(0); // fail-open
}

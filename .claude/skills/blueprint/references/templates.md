# blueprint 산출물 템플릿 (5종 + plan.md)

> 아래 골격을 그대로 쓰되, 인터뷰 답으로 채운다. 답 안 받은 칸은 지어내지 말고 `[미정]`.
> 이모지 금지. 개발용어 첫 등장 시 괄호로 한 줄 풀이.

---

## 01-prd.md

```markdown
# PRD — [서비스명]
> 작성일: [날짜] · blueprint 인터뷰 기반 · 상태: 초안/확정

## 1. 개요
- 한 줄 정의: [1-1]
- 레퍼런스: [1-2] (다른 점: [1-C2])
- 배경·동기: [1-3]
- 성공 기준: [1-4]

## 2. 문제·타겟
- 페르소나: [2-1]
- 문제 장면: [2-2]
- 현재 대안과 한계: [2-3] / [2-4]
- 사용자 vs 결제자: [2-5] · 규모 가늠: [2-6]

## 3. 기능 (MVP)
| 순위 | 기능 | 완료 기준 |
|---|---|---|
| 1 | [3-6 1위] | [3-3] |
| 2 | ... | ... |
| 3 | ... | ... |

### 나중에 (이번엔 안 함)
- [3-4 목록]

### Out of Scope (절대 안 함)
- [3-5 목록]

## 4. 유저 플로우
→ 03-userflow.md

## 5. 화면 정의
→ 02-spec.md · 04-wireframe.html

## 6. 데이터 모델
→ 05-db.md

## 7. 외부 연동
**기본 스택**: Supabase(저장·로그인) · Vercel(배포) [· Cloudflare — 포함 시 사유 명시: 도메인 DNS / 이미지 R2. 미포함 판정이면 이 항목 자체를 지운다]

| 기능 | 플랫폼 | 발급처 | .env 키 |
|---|---|---|---|
| [로그인] | [Supabase Auth] | supabase.com | SUPABASE_URL 외 |

## 8. 비기능
- 권한 등급: [8-1]
- 관리자: [8-2]
- 최우선 보호 데이터: [8-3]
- 실패 시 안내: [8-4] · 외부 장애 시: [8-5]
- 문의 채널: [8-6] · 백업: [8-7]
```

---

## 02-spec.md (기능명세서)

```markdown
# 기능명세서 — [서비스명]

## 화면: [화면명] ([이 화면의 목적 한 가지])
| No | 구분 | 기능 | 설명 | 우선순위 |
|---|---|---|---|---|
| 1 | 표시 | [로고] | 상단 고정 | MVP |
| 2 | 입력 | [제목 입력칸] | 필수 · 30자 · 비면 "[오류 문구]" | MVP |
| 3 | 동작 | [생성 버튼] | 누르면 → [목적지 화면] | MVP |
| 4 | 표시 | 빈 상태 | 데이터 0건이면 "[안내 문구]" + [버튼] | MVP |
(화면마다 반복. 구분 = 표시/입력/동작/목록. 우선순위 = MVP/나중에)
```

---

## 03-userflow.md

```markdown
# 유저 플로우 — [서비스명]

## 메인 플로우 (첫 방문 → 목적 달성)
​```mermaid
flowchart TD
  A[접속: 메인 화면] --> B[제목 입력]
  B --> C{생성}
  C -->|성공| D[결과 화면]
  C -->|실패| E[실패 안내 + 다시 시도]
  E --> B
  D --> F[다운로드 → 저장 완료 표시]
​```

## 재방문 플로우
[4-6]

## 운영자 플로우
[4-7]

## 상태 흐름 (있으면)
​```mermaid
stateDiagram-v2
  대기 --> 확정
  대기 --> 취소
  확정 --> 취소
​```
```

---

## 04-wireframe.html (로파이)

원칙: 회색 박스 + 라벨만. 색·폰트·꾸밈 금지 (뼈대 확인용). 화면 하나 = section 하나.

```html
<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>와이어프레임 — [서비스명]</title>
<style>
body{font-family:system-ui;background:#f5f5f4;margin:0;padding:32px;color:#333}
h1{font-size:20px} h2{font-size:15px;color:#666;margin:32px 0 8px}
.screen{background:#fff;border:2px solid #ccc;border-radius:8px;max-width:420px;padding:16px;margin-bottom:8px}
.box{background:#e5e5e3;border:1px dashed #aaa;border-radius:4px;padding:14px;margin:8px 0;text-align:center;color:#555;font-size:13px}
.btn{background:#d4d4d2;border:1px solid #999;border-radius:6px;padding:10px;text-align:center;font-size:13px;margin:8px 0}
.note{font-size:12px;color:#999}
</style></head><body>
<h1>와이어프레임 — [서비스명] (로파이 · 뼈대만)</h1>

<h2>화면 1. [메인] — 목적: [한 가지]</h2>
<div class="screen">
  <div class="box">로고</div>
  <div class="box">제목 입력칸 (필수 · 30자)</div>
  <div class="btn">생성 버튼 → 화면 2</div>
  <div class="note">빈 상태: 해당 없음</div>
</div>
<!-- 화면마다 반복 -->
</body></html>
```

---

## 05-db.md

```markdown
# DB 설계 — [서비스명]

## 표 목록
| 표 | 무엇 | 소유 | 1년 규모 |
|---|---|---|---|
| users | 회원 | 본인 | [6-16] |

## 관계 도식
​```mermaid
erDiagram
  USERS ||--o{ RESERVATIONS : "1명이 여러 건"
  ROOMS ||--o{ RESERVATIONS : "1실에 여러 건"
​```

## 표 상세: [reservations]
| 항목 | 종류 | 필수 | 중복금지 | 비고 |
|---|---|---|---|---|
| id | 번호(자동) | O | O | |
| user_id | 연결(users) | O | | 1:N 꼬리표 |
| status | 글자 | O | | 대기/확정/취소 · 흐름: [6-C2] |
| created_at / updated_at | 시각(자동) | O | | 기본 포함 |

## 권한 (RLS = 창고 문 앞 출입 규칙)
| 표 | 읽기 | 쓰기 | 수정·삭제 |
|---|---|---|---|
| reservations | 본인만 + 관리자 전체 | 본인 | 본인(취소만) · ⚠️ 공개(anon) DELETE/UPDATE 금지 |

## 삭제 정책
[6-11] (soft delete 여부 · 연결 데이터 처리 · 복구 절차 [6-C3])

## 검색·정렬
검색: [6-12] → 인덱스 후보 · 정렬: [6-13]

## 초기 데이터(시드)
[6-15]

## SQL 초안 (Supabase)
​```sql
create table reservations (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id),
  status text not null default '대기',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table reservations enable row level security;
-- 본인 것만 읽기
create policy "own read" on reservations for select using (auth.uid() = user_id);
-- 본인만 생성
create policy "own insert" on reservations for insert with check (auth.uid() = user_id);
-- ⚠️ DELETE/UPDATE 는 공개 정책으로 열지 않는다 (사고 원천 차단)
​```
```

---

## plan.md 갱신 규칙

- "한 문장 소개" ← 1-1
- "데이터" ← 6단계 표·관계 요약 (2~4줄)
- "블럭" ← 3-6 순서대로 체크리스트 (5±2개, 마지막 줄에 "스코프컷 밖" 명시)
- "스코프컷" ← 3-5
- Handoff 칸은 비워 둔다 (세션 끝에 채우는 칸)

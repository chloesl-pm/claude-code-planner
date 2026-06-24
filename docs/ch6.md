# CHAPTER 6. 카카오클라우드 사용자 가이드 작성

> 공식 Docs 레포지토리를 로컬에 clone하고, VS Code에서 문서를 직접 편집하면서 Claude Code로 초안·수정을 자동화한 뒤 PR로 검수한다

## 🗂️ 배경 — 기획자가 왜 Docs를 직접 작성하는가

KakaoCloud 공식 사용자 가이드(kc-docs)는 GitHub 레포지토리로 관리됩니다. 신규 기능이 출시되거나 기획 내용이 변경되면, 기획자가 직접 문서 수정 초안을 작성하고 docs 담당자가 검수하는 구조입니다.

:::tip 💡 기획자가 Docs 초안을 직접 쓰는 이유
- 기획자는 신규 기능의 **동작 방식·정책·예외 케이스**를 가장 정확하게 알고 있습니다.
- 개발 완료 후 docs 담당자에게 내용을 전달하는 과정에서 **정보 손실·해석 오류**가 발생할 수 있습니다.
- 기획자가 초안을 직접 작성하면 docs 담당자는 **표현·포맷 검수에만 집중**할 수 있어 전체 속도가 빨라집니다.
- Claude Code를 활용하면 **레포지토리 구조 파악·한영 파일 동기화·포맷 준수**를 자동으로 처리할 수 있습니다.
:::

## 🖥️ 작업 환경 — VS Code + Claude Code

kc-docs 문서 작업은 **VS Code에서 파일을 직접 열고 편집**하면서, **Claude Code CLI를 같은 터미널에서 함께 실행**하는 방식으로 진행합니다.

| 도구 | 역할 | 주요 사용 시점 |
| --- | --- | --- |
| **VS Code** | 파일 탐색·직접 편집·diff 확인·Git 상태 시각화 | Claude Code 수정 결과 검토, 세부 내용 직접 수정, 파일 구조 파악 |
| **Claude Code CLI** | 자연어 지시로 파일 수정·포맷 준수·한영 동기화·commit 자동화 | 초안 작성, 반복 수정, 메타데이터 갱신, 변경 요약 |
| **Git (터미널)** | 브랜치 관리·push·PR 생성 | 작업 브랜치 생성 및 원격 push |

:::tip 💡 VS Code와 Claude Code를 함께 쓰는 이유
Claude Code는 자연어 지시로 파일을 빠르게 수정해주지만, **결과물의 최종 검토와 세부 조정은 기획자가 VS Code에서 직접** 합니다. Markdown 파일을 눈으로 보면서 내용을 다듬고, Git diff로 변경 범위를 확인하는 작업은 VS Code가 훨씬 편합니다. 두 도구를 함께 쓰면 **"Claude Code가 빠르게 초안을 만들고, 기획자가 VS Code에서 마무리한다"**는 흐름이 완성됩니다.
:::

### 환경 세팅 (최초 1회)

```bash
# 1. 레포지토리 clone
git clone https://github.kakaoenterprise.in/kic2/kc-docs /Users/kakao_ent/kc-docs

# 2. VS Code로 열기
code /Users/kakao_ent/kc-docs

# 3. VS Code 내장 터미널에서 Claude Code 실행
cd /Users/kakao_ent/kc-docs
claude
```

> 💡 **VS Code 내장 터미널**(⌃` 또는 View → Terminal)에서 Claude Code를 실행하면, 에디터 창과 터미널을 동시에 보면서 작업할 수 있어 가장 효율적입니다.

## 📦 레포지토리 정보

| 구분 | URL / 경로 |
| --- | --- |
| **퍼블릭** | `https://github.kakaoenterprise.in/kic2/kc-docs` |
| **Gov** | `https://github.kakaoenterprise.in/kic2/kc-docs-gov` |
| **로컬 경로** | `/Users/kakao_ent/kc-docs` |

## 🔄 kc-docs 문서 수정 워크플로우

:::info 📋 전체 흐름
**[기획자]** → **VS Code + Claude Code** → **[로컬 수정 · 검토]** → **commit / push (작업 브랜치)** → **[docs 담당자 검수]** → **main merge**
:::

### 1단계. 최초 1회 — Docs 구조 분석

| 분석 항목 | 내용 |
| --- | --- |
| **서비스별 문서 위치** | `docs/service/analytics/data-catalog/` 등 서비스 디렉토리 구조 파악 |
| **파일 유형 파악** | 릴리즈 노트, 사용자 가이드, how-to-guides 등 문서 종류별 위치 파악 |
| **한/영 대응 구조** | 한국어 `docs/` ↔ 영문 `i18n/en/` 디렉토리 대응 관계 파악 |
| **문서 포맷·규칙** | frontmatter 구조, 헤딩 규칙, RSS 서식 등 포맷 규칙 파악 |

### 2단계. 수정 요청

```
# 요청 예시 ①
"Data Catalog 릴리즈 노트에 2026.01.27 항목 영문 번역 추가해줘"

# 요청 예시 ②
"Object Storage 사용자 가이드에 신규 기능 A 내용 추가해줘"

# 요청 예시 ③
"Pub/Sub Push Subscription Access Key 인증 기능 가이드 초안 작성해줘.
인증 방식은 Access Key이고, 헤더명은 kakaoc-pubsub-push-access-key야."
```

### 3단계. Claude Code 자동 처리 + VS Code 검토

| 처리 항목 | 내용 | 담당 |
| --- | --- | --- |
| **파일 위치 자동 탐색** | 서비스명 기준으로 한/영 파일 위치를 자동으로 찾아 열기 | Claude Code |
| **포맷 준수 수정** | 기존 문서의 헤딩 구조·서식에 맞춰 내용 추가·수정 | Claude Code |
| **메타데이터 업데이트** | frontmatter의 `updated` 날짜 등 자동 갱신 | Claude Code |
| **결과물 검토·수정** | VS Code에서 수정된 파일 열어 내용 확인, 필요 시 직접 편집 | **기획자** |
| **변경 내역 확인** | VS Code Source Control 탭 또는 `git diff`로 변경 범위 최종 확인 | **기획자** |
| **commit** | 변경 내용 요약 후 commit 메시지 자동 생성 | Claude Code |

### 4단계. Push (작업 브랜치)

```bash
# 작업 브랜치 생성 및 push (main 직접 push 금지)
git checkout -b feat/pubsub-access-key-guide
git push origin feat/pubsub-access-key-guide

# PR 생성 → docs 담당자 검수 요청
```

## 🔑 핵심 원칙

:::warning ⚠️ kc-docs 작업 시 반드시 지켜야 할 원칙
- 🚫 **Claude Code는 main에 직접 push하지 않습니다.** 항상 작업 브랜치 기준으로 진행합니다.
- 🔁 **한국어 파일 수정 시 영문 파일(`i18n/en/`) 동기화 여부를 반드시 확인합니다.**
- 📋 **수정은 기존 문서의 포맷·규칙을 그대로 따릅니다.** frontmatter, 헤딩 구조, RSS 서식 등 준수.
- 👀 **Claude Code 수정 결과는 반드시 VS Code에서 검토합니다.** 기획자가 내용의 정확성을 최종 확인합니다.
:::

## 💬 실전 프롬프트 예시

```
# Docs 구조 파악 (최초 1회)
"kc-docs 레포지토리 전체 구조를 파악해줘.
서비스별 문서 위치, 한/영 대응 구조, 파일 포맷 규칙을 정리해줘."

# 릴리즈 노트 항목 추가
"Pub/Sub 릴리즈 노트에 2026.06.24 항목을 추가해줘.
내용: Push Subscription Access Key 인증 기능 신규 추가.
한국어 파일 수정 후 영문 파일도 함께 동기화해줘."

# 신규 가이드 초안 작성
"Pub/Sub 사용자 가이드에 Push Subscription Access Key 인증 설정 방법 섹션을 추가해줘.
기존 가이드의 헤딩·서식 규칙을 그대로 따르고,
수정 완료 후 frontmatter의 updated 날짜도 오늘 날짜로 업데이트해줘."
```

## 📊 Before / After

| 작업 | Before | After | 단축 효과 |
| --- | --- | --- | --- |
| **레포 구조 파악** | 디렉토리 직접 탐색 · 파일 열어보며 파악 (~1시간) | Claude Code 1회 분석으로 전체 구조 파악 (~5분) | **92% ↓** |
| **가이드 초안 작성** | 포맷 확인 → 직접 작성 → 한/영 파일 각각 수정 (~2~3시간) | 요청 한 줄 → Claude Code 초안 → VS Code에서 검토·확정 (~30분) | **83% ↓** |
| **릴리즈 노트 추가** | 기존 항목 포맷 확인 · 한/영 각각 작성 · 날짜 수동 업데이트 (~1시간) | 요청 후 한/영 동시 추가 · 메타데이터 자동 갱신 · VS Code 확인 (~15분) | **75% ↓** |
| **PR 준비** | 변경 파일 직접 확인 · commit 메시지 작성 (~20분) | VS Code diff 확인 → Claude Code commit 메시지 자동 생성 (~3분) | **85% ↓** |

> 💡 **권장 환경:** VS Code + Claude Code CLI (VS Code 내장 터미널)  
> kc-docs 레포지토리는 사내망에서만 접근 가능하므로 VPN 또는 사내 네트워크 연결이 필요합니다.

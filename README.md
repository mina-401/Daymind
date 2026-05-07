# Daymind
 [![Vercel](https://img.shields.io/badge/배포링크-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://daymind-theta.vercel.app/)
> DayMind는 할일 관리, 루틴 트래킹, 집중 타이머, 데일리 로그를 하나의 앱으로 통합한 플래너입니다. <br>
> 일상의 활동을 퀘스트 형식으로 관리하며 꾸준한 습관 형성을 돕습니다.

## 주요 기능
### ⚔️ 일일 퀘스트
- 오늘의 할일을 퀘스트 형식으로 관리
- 에너지 소모량 태그 (🔴 고 / 🟡 중 / 🟢 저)
- 미완료 할일 다음날 자동 이월 → `Zustand action` 으로 날짜 비교 후 이월 처리
- XP 기반 진행 로드맵 → 할일 완료 시 XP 누적, 마일스톤 시각화

### 📅 캘린더
- 월간 달력으로 날짜별 할일 관리
- 시간 설정 시 타임블록으로 시각화 → `startTime` 유무로 일반 목록 / 타임블록 분리

### 🔥 루틴 퀘스트
- 스테이지 방식의 습관 관리 → 순차/병렬 스테이지 구조
- 오늘 체크 시 다음 스테이지 자동 해금
- 잔디로 달성 현황 시각화 → 날짜별 `records` 로 체크 기록 관리
- D-day 및 주차별 진행도 확인

### ⏱ 타이머
- 뽀모도로 타이머 → `setInterval` + `Zustand` 로 1초 단위 tick 구현
- 할일 연동 집중 세션 기록
- 10분 단위 / 시간 단위 설정

### 📝 데일리 로그
- 날짜별 할일 / 루틴 / 집중시간 요약 → `todoStore` / `routineStore` / `timerStore` 멀티 스토어 조합
- 포스트잇 형식 메모

### 🗺️ 주간 뷰
- 이번주 날짜별 할일 현황
- 타임블록 시각화

### 🖱️ 드래그 버튼
- `useRef` + DOM 직접 조작으로 리렌더링 없이 부드러운 드래그 구현
- 위치 `LocalStorage` 저장으로 새로고침 후에도 유지

## 🛠 기술 스택
![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_API-D4A27A?style=for-the-badge&logo=anthropic&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

| 분류 | 기술 |
|------|------|
| Framework | React Router v7 |
| Language | TypeScript |
| 상태관리 | Zustand + persist |
| 스타일 | Tailwind CSS v4 |
| 빌드 | Vite |
| PWA | vite-plugin-pwa |
| AI | Claude API (claude-sonnet-4) |
| 배포 | Vercel |
| 폰트 | 온글잎 긍정 |

## 설계 구조

### 레이어 구조

![layer_src](/images/layer.png)

### 파일구조
```
daymind/
├── app/
│   ├── routes/                 # 페이지
│   │   ├── _layout.tsx         # 하단 네비게이션
│   │   ├── today.tsx           # 오늘 (할일/주간/습관)
│   │   ├── calendar.tsx        # 캘린더
│   │   ├── timer.tsx           # 타이머
│   │   ├── memo.tsx            # 데일리 로그
│   │   └── memo.$id.tsx        # 메모 편집
│   │
│   ├── components/             # 공통 컴포넌트
│   │   ├── ui/
│   │   │   ├── EnergyTag.tsx   # 에너지 태그
│   │   │   └── DraggableButton.tsx
│   │   │
│   │   ├── todo/
│   │   │   ├── TodoItem.tsx    # 할일 카드
│   │   │   ├── TodoList.tsx    # 할일 목록
│   │   │   └── TodoModal.tsx   # 추가/수정 모달
│   │   │
│   │   ├── calendar/
│   │   │   ├── MonthlyView.tsx # 월간 달력
│   │   │   └── DayView.tsx
│   │   │
│   │   ├── timer/
│   │   │   ├── TimerDisplay.tsx
│   │   │   ├── TimerControls.tsx
│   │   │   └── TodoSelector.tsx
│   │   │
│   │   ├── habit/
│   │   │   ├── RoutineMap.tsx  # 루틴 맵
│   │   │   ├── StageCard.tsx   # 스테이지 카드
│   │   │   └── StageEditor.tsx # 스테이지 편집
│   │   │
│   │   ├── memo/
│   │   │   └── MemoCard.tsx
│   │   │
│   │   └── today/
│   │       ├── RolloverBanner.tsx  # 이월 배너
│   │       └── WeeklyView.tsx      # 주간 뷰
│   │
│   ├── store/                  # 전역 상태관리
│   │   ├── todoStore.ts
│   │   ├── timerStore.ts
│   │   ├── memoStore.ts
│   │   └── routineStore.ts
│   │
│   ├── types/
│   │   └── index.ts            # 타입 정의
│   │
│   ├── root.tsx                # HTML 틀
│   ├── routes.ts               # URL 매핑
│   └── app.css                 # 전역 스타일
│
├── public/
│   ├── fonts/                  # 온글잎 긍정 폰트
│   └── icons/                  # 아이콘
│
├── vite.config.ts              # 빌드 설정
├── react-router.config.ts      # 라우터 설정
└── package.json

```

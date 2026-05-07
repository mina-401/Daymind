# Daymind

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

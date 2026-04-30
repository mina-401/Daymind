# Daymind

### 파일구조
```
app/
├─ components/   # UI 및 기능 단위 컴포넌트
├─ routes/       # 페이지 라우팅
├─ store/        # 상태 관리 (전역 상태)
├─ types/        # 타입 정의
├─ utils/        # 공통 유틸 함수
└─ root.tsx      # 앱 진입점

components/
├─ calendar/   # 캘린더 관련 UI
├─ layout/     # 공통 레이아웃 (네비, 헤더)
├─ memo/       # 메모 기능
├─ timer/      # 타이머 기능
├─ today/      # 오늘(메인) 화면 구성 요소
├─ todo/       # 할 일 관리
└─ ui/         # 재사용 가능한 공통 UI (버튼, 모달 등)

routes/
├─ _layout.tsx      # 공통 레이아웃 (하단 네비게이션)
├─ today.tsx        # 메인 화면
├─ calendar.tsx     # 캘린더
├─ timer.tsx        # 타이머
├─ memo.tsx         # 메모
└─ settings.tsx     # 설정

store/         # 공통 데이터 관리
├─ todoStore.ts
├─ timerStore.ts
└─ memoStore.ts

types/
└─ index.ts        # 공통 타입 정의

utils/
├─ dateUtils.ts    # 날짜 관련 처리
├─ rollover.ts     # 하루 초기화 로직
└─ storage.ts      # 로컬 저장소 처리

```

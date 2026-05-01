// app/routes.ts
import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [   // ← 모든 페이지 하단 네비 적용
    index("routes/today.tsx"),      // ← /        → today.tsx
    route("calendar", "routes/calendar.tsx"),  // ← /calendar → calendar.tsx
    route("timer", "routes/timer.tsx"),        // ← /timer    → timer.tsx
    route("memo", "routes/memo.tsx"),          // ← /memo     → memo.tsx
    route("memo/:id", "routes/memo.$id.tsx"),  // ← /memo/123 → memo.$id.tsx
  ]),
] satisfies RouteConfig;
import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/today.tsx"),
    route("calendar", "routes/calendar.tsx"),
    route("timer", "routes/timer.tsx"),
    route("memo", "routes/memo.tsx"),
  ]),
  route("memo/:id", "routes/memo.$id.tsx"),  // ← 레이아웃 밖으로
] satisfies RouteConfig;
// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" >
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var redirect = sessionStorage.getItem('redirect');
              if (redirect) {
                sessionStorage.removeItem('redirect');
                window.history.replaceState(null, null, redirect);
              }
            })();
          `
        }} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />   {/* ← app.css, 폰트 등 연결 */}
      </head>
      <body>
        {children}  {/* ← 모든 페이지 내용이 여기 들어옴 */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;  {/* ← routes.ts 에서 매칭된 페이지 렌더링 */}
}
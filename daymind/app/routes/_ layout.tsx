import { Outlet, NavLink } from "react-router";

export default function Layout() {
  return (
    <div className="paper-texture min-h-screen pb-32">
      <Outlet />

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 pt-4 pb-8 bg-white/95 backdrop-blur-md rounded-t-[32px] border-t border-[#eee] shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
        
        <NavLink to="/" end className={({ isActive }) =>
          isActive ? "flex flex-col items-center gap-1" : "flex flex-col items-center gap-1 text-[#a4a4c4]"
        }>
          {({ isActive }) => (
            <>
              <div className={isActive ? "bg-[#eee8d5] text-[#8c7a2e] p-3 rounded-2xl mb-1 border border-[#dcd7c5] glossy-bubble" : "p-3"}>
                <span className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  today
                </span>
              </div>
              <span className="font-bold text-[10px] uppercase tracking-wider">오늘</span>
            </>
          )}
        </NavLink>

        <NavLink to="/calendar" className={({ isActive }) =>
          isActive ? "flex flex-col items-center gap-1" : "flex flex-col items-center gap-1 text-[#a4a4c4]"
        }>
          {({ isActive }) => (
            <>
              <div className={isActive ? "bg-[#eee8d5] text-[#8c7a2e] p-3 rounded-2xl mb-1 border border-[#dcd7c5] glossy-bubble" : "p-3"}>
                <span className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  calendar_month
                </span>
              </div>
              <span className="font-bold text-[10px] uppercase tracking-wider">캘린더</span>
            </>
          )}
        </NavLink>

        <NavLink to="/timer" className={({ isActive }) =>
          isActive ? "flex flex-col items-center gap-1" : "flex flex-col items-center gap-1 text-[#a4a4c4]"
        }>
          {({ isActive }) => (
            <>
              <div className={isActive ? "bg-[#eee8d5] text-[#8c7a2e] p-3 rounded-2xl mb-1 border border-[#dcd7c5] glossy-bubble" : "p-3"}>
                <span className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  timer
                </span>
              </div>
              <span className="font-bold text-[10px] uppercase tracking-wider">타이머</span>
            </>
          )}
        </NavLink>

        <NavLink to="/memo" className={({ isActive }) =>
          isActive ? "flex flex-col items-center gap-1" : "flex flex-col items-center gap-1 text-[#a4a4c4]"
        }>
          {({ isActive }) => (
            <>
              <div className={isActive ? "bg-[#eee8d5] text-[#8c7a2e] p-3 rounded-2xl mb-1 border border-[#dcd7c5] glossy-bubble" : "p-3"}>
                <span className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  notes
                </span>
              </div>
              <span className="font-bold text-[10px] uppercase tracking-wider">메모</span>
            </>
          )}
        </NavLink>

      </nav>
    </div>
  );
}
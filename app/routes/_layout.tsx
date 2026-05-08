import { Outlet, NavLink } from "react-router";

export default function Layout() {
  return (
    <div className="bg-dots min-h-screen pb-32">
  
      <Outlet />

      <nav className="bottom-nav fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-8">

        <NavLink to="/" end>
          {({ isActive }) => (
            <div className="flex flex-col items-center gap-1">
              <div className={isActive ? "bottom-nav-active px-5 py-2 mb-1" : "px-5 py-2 mb-1"}>
                <img
                  src="/icons/fi-rs-list-check.png"
                  alt="check"
                  className={`w-6 h-6 ${isActive ? '' : 'opacity-40'}`}
                  style={{ filter: isActive ? 'invert(27%) sepia(51%) saturate(500%) hue-rotate(230deg)' : 'none' }}
                />
              </div>
              <span className={`font-bold text-[10px] uppercase tracking-wider ${isActive ? 'text-[#674bb5]' : 'text-[#7a7583]'}`}>
                오늘
              </span>
            </div>
          )}
        </NavLink>

        <NavLink to="/calendar">
          {({ isActive }) => (
            <div className="flex flex-col items-center gap-1">
              <div className={isActive ? "bottom-nav-active px-5 py-2 mb-1" : "px-5 py-2 mb-1"}>
                <img
                  src="/icons/fi-rs-calendar.png"
                  alt="calendar"
                  className={`w-6 h-6 ${isActive ? '' : 'opacity-40'}`}
                  style={{ filter: isActive ? 'invert(27%) sepia(51%) saturate(500%) hue-rotate(230deg)' : 'none' }}
                />
              </div>
              <span className={`font-bold text-[10px] uppercase tracking-wider ${isActive ? 'text-[#674bb5]' : 'text-[#7a7583]'}`}>
                캘린더
              </span>
            </div>
          )}
        </NavLink>

        <NavLink to="/timer">
          {({ isActive }) => (
            <div className="flex flex-col items-center gap-1">
              <div className={isActive ? "bottom-nav-active px-5 py-2 mb-1" : "px-5 py-2 mb-1"}>
                <img
                  src="/icons/fi-rs-time-oclock.png"
                  alt="timer"
                  className={`w-6 h-6 ${isActive ? '' : 'opacity-40'}`}
                  style={{ filter: isActive ? 'invert(27%) sepia(51%) saturate(500%) hue-rotate(230deg)' : 'none' }}
                />
              </div>
              <span className={`font-bold text-[10px] uppercase tracking-wider ${isActive ? 'text-[#674bb5]' : 'text-[#7a7583]'}`}>
                타이머
              </span>
            </div>
          )}
        </NavLink>

        <NavLink to="/memo">
          {({ isActive }) => (
            <div className="flex flex-col items-center gap-1">
              <div className={isActive ? "bottom-nav-active px-5 py-2 mb-1" : "px-5 py-2 mb-1"}>
                <img
                  src="/icons/fi-rs-file-ai.png"
                  alt="memo"
                  className={`w-6 h-6 ${isActive ? '' : 'opacity-40'}`}
                  style={{ filter: isActive ? 'invert(27%) sepia(51%) saturate(500%) hue-rotate(230deg)' : 'none' }}
                />
              </div>
              <span className={`font-bold text-[10px] uppercase tracking-wider ${isActive ? 'text-[#674bb5]' : 'text-[#7a7583]'}`}>
                요약
              </span>
            </div>
          )}
        </NavLink>

      </nav>
    </div>
  )
}
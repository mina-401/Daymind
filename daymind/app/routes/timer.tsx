import { useTimerStore } from '../store/timerStore'
import TodoSelector from '../components/timer/TodoSelector'
import TimerDisplay from '../components/timer/TimerDisplay'
import TimerControls from '../components/timer/TimerControls'
import { useTodoStore } from '../store/todoStore'

export default function Timer() {
  const { sessions } = useTimerStore()
  const { todos } = useTodoStore()  

  const today = new Date().toISOString().split('T')[0]
  const todaySessions = sessions.filter((s) =>
    s.completedAt.startsWith(today)
  )
  const totalSeconds = todaySessions.reduce((acc, s) => acc + s.duration, 0)
  const totalMinutes = Math.floor(totalSeconds / 60)

  return (
    <>
      {/* 헤더 */}
      <header className="bg-[#a4a4c4] pt-4 pb-6 px-4 rounded-b-[24px]">
        <div className="flex justify-between items-center">
          <h1 className="text-white font-bold text-xl px-2">타이머</h1>
          <div className="flex items-center gap-2 bg-[#3b3b55]/80 text-white pl-3 pr-4 py-1.5 rounded-full text-sm">
            <img
              src="/icons/fi-rr-alarm-clock.png"
              alt="session"
              className="w-5 h-5 invert brightness-0 hover:opacity-100"
            />
            <span className="font-bold">{todaySessions.length} 세션</span>
            <span className="text-white/50 mx-1">|</span>
            <span className="font-bold">{totalMinutes}분</span>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="px-4 mt-5 max-w-2xl mx-auto">

        {/* 할일 선택 */}
        <TodoSelector />

        {/* 타이머 디스플레이 */}
        <div className="bg-white rounded-2xl border border-[#eee] mb-4">
          <TimerDisplay />
        </div>

        {/* 컨트롤 버튼 */}
        <TimerControls />

       {/* 오늘 세션 기록 */}
      {todaySessions.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#eee] p-4 mt-4">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider">
              오늘 세션 기록
            </span>
          </div>
          <div className="space-y-2">
            {todaySessions.map((session, idx) => {
              const linkedTodo = todos.find((t) => t.id === session.todoId)
              return (
                <div key={session.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[#a4a4c4]">
                      #{idx + 1}
                    </span>
                    <span className="text-[13px] font-medium text-[#4a443a]">
                      {linkedTodo ? linkedTodo.title : '자유 집중'}
                    </span>
                    <span className="text-[12px] text-[#a4a4c4]">
                      {Math.floor(session.duration / 60)}분
                    </span>
                  </div>
                  <span className="text-[11px] text-[#a4a4c4]">
                    {new Date(session.completedAt).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      </main>
    </>
  )
}
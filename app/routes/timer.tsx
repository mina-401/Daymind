import { useTimerStore } from '../store/timerStore'
import TodoSelector from '../components/timer/TodoSelector'
import TimerDisplay from '../components/timer/TimerDisplay'
import TimerControls from '../components/timer/TimerControls'
import { useTodoStore } from '../store/todoStore'

export default function Timer() {
  const { sessions } = useTimerStore()
  const { todos } = useTodoStore()

  const today = new Date().toISOString().split('T')[0]
  const todaySessions = sessions.filter((s) => s.completedAt.startsWith(today))
  const totalSeconds = todaySessions.reduce((acc, s) => acc + s.duration, 0)
  const totalMinutes = Math.floor(totalSeconds / 60)

  return (
    <>
      {/* 헤더 */}
      <header className="app-header px-5 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-primary-border)' }}>
              <span className="material-symbols-outlined text-[20px]"
                style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                timer
              </span>
            </div>
            <h1 className="font-bold text-xl" style={{ color: 'var(--color-primary)' }}>타이머</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2"
            style={{ backgroundColor: 'var(--color-surface-container)', borderColor: 'var(--color-primary-container)' }}>
            <span className="material-symbols-outlined text-[16px]"
              style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
              {todaySessions.length}세션
            </span>
            <span style={{ color: 'var(--color-text-light)' }}>|</span>
            <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
              {totalMinutes}분
            </span>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="px-4 mt-5 max-w-2xl mx-auto pb-32">

        {/* 할일 선택 */}
        <TodoSelector />

        {/* 타이머 디스플레이 */}
        <div className="rounded-[32px] border mb-4 shadow-sm"
          style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>
          <TimerDisplay />
        </div>

        {/* 컨트롤 버튼 */}
        <TimerControls />

        {/* 세션 기록 */}
        {todaySessions.length > 0 && (
          <div className="rounded-[32px] border p-5 mt-4 shadow-sm"
            style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px]"
                style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                history
              </span>
              <span className="text-[12px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}>
                오늘 세션 기록
              </span>
            </div>
            <div className="space-y-2">
              {todaySessions.map((session, idx) => {
                const linkedTodo = todos.find((t) => t.id === session.todoId)
                return (
                  <div key={session.id} className="flex items-center justify-between py-1.5 border-b last:border-b-0"
                    style={{ borderColor: 'var(--color-primary-container)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
                        #{idx + 1}
                      </span>
                      <span className="text-[13px] font-medium"
                        style={{ color: 'var(--color-text)' }}>
                        {linkedTodo ? linkedTodo.title : '자유 집중'}
                      </span>
                      <span className="text-[12px] font-bold"
                        style={{ color: 'var(--color-primary)' }}>
                        {Math.floor(session.duration / 60)}분
                      </span>
                    </div>
                    <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                      {new Date(session.completedAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit', minute: '2-digit',
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
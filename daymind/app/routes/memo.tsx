import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useMemoStore } from '../store/memoStore'
import { useTodoStore } from '../store/todoStore'
import { useTimerStore } from '../store/timerStore'
import { useHabitStore } from '../store/habitStore'

function getWeekDates() {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

export default function Memo() {
  const navigate = useNavigate()
  const { memos, getOrCreateDailyMemo } = useMemoStore()
  const { todos } = useTodoStore()
  const { sessions } = useTimerStore()
  const { habits, records } = useHabitStore()

  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const weekDates = getWeekDates()

  // 선택한 날짜 데이터
  const dayTodos = todos.filter((t) => t.date === selectedDate)
  const completedTodos = dayTodos.filter((t) => t.isCompleted)
  const incompleteTodos = dayTodos.filter((t) => !t.isCompleted)

  const daySessions = sessions.filter((s) => s.completedAt.startsWith(selectedDate))
  const totalMinutes = Math.floor(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60)

  const dayHabits = habits.map((h) => ({
    ...h,
    isCompleted: records.some(
      (r) => r.habitId === h.id && r.date === selectedDate && r.isCompleted
    ),
  }))
  const completedHabits = dayHabits.filter((h) => h.isCompleted)

  // 날짜 포맷
  const selectedDateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const handleOpenMemo = () => {
    const id = getOrCreateDailyMemo(selectedDate)
    navigate(`/memo/${id}`)
  }

  return (
    <>
      {/* 헤더 */}
      <header className="bg-[#a4a4c4] pt-4 pb-6 px-4 rounded-b-[24px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white font-bold text-xl px-2">데일리 로그</h1>
          <div className="flex items-center gap-2 bg-[#3b3b55]/80 text-white pl-3 pr-4 py-1.5 rounded-full text-sm">
            <span className="material-symbols-outlined text-[16px] text-yellow-300"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="font-bold">{memos.length}개 로그</span>
          </div>
        </div>

        {/* 주간 날짜 바 */}
        <div className="flex justify-between px-1">
          {weekDates.map((date, i) => {
            const isToday = date === today
            const isSelected = date === selectedDate
            const DAYS = ['월', '화', '수', '목', '금', '토', '일']
            const dayTodosCount = todos.filter((t) => t.date === date && t.isCompleted).length
            const hasMemo = memos.some((m) => m.date === date)

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className="flex flex-col items-center gap-1"
              >
                <span className={`text-[11px] font-bold ${
                  i === 5 ? 'text-blue-300' :
                  i === 6 ? 'text-red-300' :
                  'text-white/70'
                }`}>
                  {DAYS[i]}
                </span>
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[14px] font-bold transition-all ${
                  isSelected
                    ? 'bg-white text-[#a4a4c4]'
                    : isToday
                    ? 'bg-white/30 text-white'
                    : 'text-white/80'
                }`}>
                  {new Date(date + 'T00:00:00').getDate()}
                </div>
                <div className={`w-1 h-1 rounded-full ${
                  hasMemo ? 'bg-yellow-300' :
                  dayTodosCount > 0 ? 'bg-white/60' :
                  'bg-transparent'
                }`} />
              </button>
            )
          })}
        </div>
      </header>

      {/* 메인 */}
      <main className="px-4 mt-5 max-w-2xl mx-auto space-y-4 pb-32">

        {/* 날짜 타이틀 */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[18px] text-[#4a443a]">{selectedDateLabel}</h2>
          <button
            onClick={handleOpenMemo}
            className="bouncy-button flex items-center gap-1.5 bg-[#a4a4c4] text-white px-4 py-2 rounded-2xl text-[13px] font-bold"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            {memos.some((m) => m.date === selectedDate) ? '로그 열기' : '로그 작성'}
          </button>
        </div>

        {/* 요약 카드 */}
        <div className="bg-white rounded-2xl border border-[#eee] p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="material-symbols-outlined text-[16px] text-[#a4a4c4]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              bar_chart
            </span>
            <span className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider">
              오늘의 요약
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center bg-[#f7f4e9] rounded-2xl p-3">
              <span className="text-[22px] font-bold text-[#4a443a]">
                {completedTodos.length}
              </span>
              <span className="text-[11px] text-[#a4a4c4] font-bold mt-0.5">
                할일 완료
              </span>
              <span className="text-[10px] text-[#c4bfb4]">
                / {dayTodos.length}개
              </span>
            </div>
            <div className="flex flex-col items-center bg-[#f7f4e9] rounded-2xl p-3">
              <span className="text-[22px] font-bold text-[#4a443a]">
                {completedHabits.length}
              </span>
              <span className="text-[11px] text-[#a4a4c4] font-bold mt-0.5">
                습관 달성
              </span>
              <span className="text-[10px] text-[#c4bfb4]">
                / {habits.length}개
              </span>
            </div>
            <div className="flex flex-col items-center bg-[#f7f4e9] rounded-2xl p-3">
              <span className="text-[22px] font-bold text-[#4a443a]">
                {totalMinutes}
              </span>
              <span className="text-[11px] text-[#a4a4c4] font-bold mt-0.5">
                집중 시간
              </span>
              <span className="text-[10px] text-[#c4bfb4]">분</span>
            </div>
          </div>
        </div>

        {/* 완료한 할일 */}
        {completedTodos.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#eee] p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px] text-[#a4a4c4]"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider">
                완료한 할일
              </span>
            </div>
            <div className="space-y-2">
              {completedTodos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#a4a4c4]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span className="text-[14px] font-medium text-[#4a443a] line-through">
                    {todo.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 미완료 할일 */}
        {incompleteTodos.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#eee] p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px] text-red-400">
                radio_button_unchecked
              </span>
              <span className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider">
                미완료 할일
              </span>
            </div>
            <div className="space-y-2">
              {incompleteTodos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#c4bfb4]">
                    radio_button_unchecked
                  </span>
                  <span className="text-[14px] font-medium text-[#a4a4c4]">
                    {todo.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 습관 달성 */}
        {habits.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#eee] p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[16px]">🔥</span>
              <span className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider">
                습관 달성
              </span>
            </div>
            <div className="space-y-2">
              {dayHabits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px]">{habit.icon}</span>
                    <span className={`text-[14px] font-medium ${
                      habit.isCompleted ? 'text-[#4a443a]' : 'text-[#c4bfb4]'
                    }`}>
                      {habit.title}
                    </span>
                  </div>
                  <span className="text-[16px]">
                    {habit.isCompleted ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 집중 세션 */}
        {daySessions.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#eee] p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px] text-[#a4a4c4]"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                timer
              </span>
              <span className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider">
                집중 세션
              </span>
            </div>
            <div className="space-y-2">
              {daySessions.map((session, idx) => {
                const linkedTodo = todos.find((t) => t.id === session.todoId)
                return (
                  <div key={session.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-[#a4a4c4]">#{idx + 1}</span>
                      <span className="text-[13px] font-medium text-[#4a443a]">
                        {linkedTodo ? linkedTodo.title : '자유 집중'}
                      </span>
                    </div>
                    <span className="text-[12px] font-bold text-[#a4a4c4]">
                      {Math.floor(session.duration / 60)}분
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 아무것도 없을 때 */}
        {dayTodos.length === 0 && habits.length === 0 && daySessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#a4a4c4]">
            <span className="text-[48px] mb-3">📅</span>
            <p className="font-bold text-[15px]">이 날의 기록이 없어요</p>
            <p className="text-[13px] mt-1">할일을 추가하거나 로그를 작성해보세요!</p>
          </div>
        )}

      </main>
    </>
  )
}
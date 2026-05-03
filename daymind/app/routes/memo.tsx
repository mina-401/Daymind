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

  const dayTodos = todos.filter((t) => t.date === selectedDate)
  const completedTodos = dayTodos.filter((t) => t.isCompleted)
  const incompleteTodos = dayTodos.filter((t) => !t.isCompleted)
  const daySessions = sessions.filter((s) => s.completedAt.startsWith(selectedDate))
  const totalMinutes = Math.floor(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60)
  const dayHabits = habits.map((h) => ({
    ...h,
    isCompleted: records.some((r) => r.habitId === h.id && r.date === selectedDate && r.isCompleted),
  }))
  const completedHabits = dayHabits.filter((h) => h.isCompleted)

  const selectedDateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('ko-KR', {
    month: 'long', day: 'numeric', weekday: 'long',
  })

  const handleOpenMemo = () => {
    const id = getOrCreateDailyMemo(selectedDate)
    navigate(`/memo/${id}`)
  }

  const DAYS = ['월', '화', '수', '목', '금', '토', '일']

  return (
    <>
      {/* 헤더 */}
      <header className="app-header px-5 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-primary-border)' }}>
              <span className="material-symbols-outlined text-[20px]"
                style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <h1 className="font-bold text-xl" style={{ color: 'var(--color-primary)' }}>데일리 로그</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2"
            style={{ backgroundColor: 'var(--color-surface-container)', borderColor: 'var(--color-primary-container)' }}>
            <span className="material-symbols-outlined text-[16px]"
              style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
              book
            </span>
            <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
              {memos.length}개 로그
            </span>
          </div>
        </div>

        {/* 주간 날짜 바 */}
        <div className="flex justify-between px-1">
          {weekDates.map((date, i) => {
            const isToday = date === today
            const isSelected = date === selectedDate
            const hasMemo = memos.some((m) => m.date === date)
            const dayTodosCount = todos.filter((t) => t.date === date && t.isCompleted).length

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[11px] font-bold"
                  style={{
                    color: i === 5 ? 'var(--color-primary)' :
                           i === 6 ? '#ba1a1a' :
                           'var(--color-text-muted)'
                  }}>
                  {DAYS[i]}
                </span>
                <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-[14px] font-bold transition-all"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-primary)' :
                                     isToday ? 'var(--color-primary-container)' :
                                     'transparent',
                    color: isSelected ? 'white' :
                           isToday ? 'var(--color-primary)' :
                           'var(--color-text)',
                  }}>
                  {new Date(date + 'T00:00:00').getDate()}
                </div>
                <div className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: hasMemo ? '#dcc66e' :
                                     dayTodosCount > 0 ? 'var(--color-primary-light)' :
                                     'transparent'
                  }} />
              </button>
            )
          })}
        </div>
      </header>

      {/* 메인 */}
      <main className="px-4 mt-5 max-w-2xl mx-auto space-y-4 pb-32">

        {/* 날짜 타이틀 + 로그 버튼 */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[18px]" style={{ color: 'var(--color-text)' }}>
            {selectedDateLabel}
          </h2>
          <button
            onClick={handleOpenMemo}
            className="bouncy-button flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[13px] font-bold"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            {memos.some((m) => m.date === selectedDate) ? '로그 열기' : '로그 작성'}
          </button>
        </div>
          {/* 포스트잇 미리보기 */}
        {(() => {
          const dailyMemo = memos.find((m) => m.date === selectedDate)
          if (!dailyMemo) return (
            <button
              onClick={handleOpenMemo}
              className="bouncy-button w-full rounded-[28px] border-2 border-dashed p-5 text-left transition-all"
              style={{ borderColor: 'var(--color-primary-container)', backgroundColor: 'transparent' }}
            >
              <div className="flex items-center gap-2"
                style={{ color: 'var(--color-text-light)' }}>
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                <span className="text-[13px] font-bold">오늘의 로그를 작성해보세요</span>
              </div>
            </button>
          )

          return (
            <button
              onClick={handleOpenMemo}
              className="bouncy-button w-full rounded-[28px] border p-5 text-left transition-all"
              style={{
                backgroundColor: '#fefce8',
                borderColor: '#fef08a',
                //boxShadow: '0 4px 0 0 #fde047'
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px]">📝</span>
                    <span className="font-bold text-[14px]"
                      style={{ color: '#713f12' }}>
                      {dailyMemo.title || `${selectedDateLabel} 로그`}
                    </span>
                  </div>
                  {dailyMemo.content ? (
                    <p className="text-[13px] leading-relaxed line-clamp-3"
                      style={{ color: '#92400e' }}>
                      {dailyMemo.content}
                    </p>
                  ) : (
                    <p className="text-[13px]" style={{ color: '#ca8a04' }}>
                      내용을 작성해보세요...
                    </p>
                  )}
                </div>
                <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-1"
                  style={{ color: '#ca8a04' }}>
                  chevron_right
                </span>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center gap-1"
                style={{ borderColor: '#fde047' }}>
                <span className="material-symbols-outlined text-[12px]"
                  style={{ color: '#ca8a04' }}>
                  schedule
                </span>
                <span className="text-[11px] font-bold"
                  style={{ color: '#ca8a04' }}>
                  {new Date(dailyMemo.updatedAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit', minute: '2-digit'
                  })} 수정
                </span>
              </div>
            </button>
          )
        })()}
        {/* 요약 카드 */}
        <div className="rounded-[28px] border p-5"
          style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>
          <div className="flex items-center gap-1.5 mb-4">
            <span className="material-symbols-outlined text-[16px]"
              style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
              bar_chart
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wider"
              style={{ color: 'var(--color-primary)' }}>
              오늘의 요약
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: completedTodos.length, label: '할일 완료', sub: `/ ${dayTodos.length}개`, icon: 'check_circle' },
              { value: completedHabits.length, label: '습관 달성', sub: `/ ${habits.length}개`, icon: 'local_fire_department' },
              { value: totalMinutes, label: '집중 시간', sub: '분', icon: 'timer' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center rounded-2xl p-3"
                style={{ backgroundColor: 'var(--color-primary-container)' }}>
                <span className="material-symbols-outlined text-[18px] mb-1"
                  style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                  {item.icon}
                </span>
                <span className="text-[22px] font-bold" style={{ color: 'var(--color-primary)' }}>
                  {item.value}
                </span>
                <span className="text-[11px] font-bold mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {item.label}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-light)' }}>
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 완료한 할일 */}
        {completedTodos.length > 0 && (
          <div className="rounded-[28px] border p-5"
            style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px]"
                style={{ color: 'var(--color-tertiary)', fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="text-[12px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}>
                완료한 할일
              </span>
            </div>
            <div className="space-y-2">
              {completedTodos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-2 py-1">
                  <span className="material-symbols-outlined text-[16px]"
                    style={{ color: 'var(--color-tertiary)', fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span className="text-[14px] font-medium line-through"
                    style={{ color: 'var(--color-text-muted)' }}>
                    {todo.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 미완료 할일 */}
        {incompleteTodos.length > 0 && (
          <div className="rounded-[28px] border p-5"
            style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px]"
                style={{ color: 'var(--color-error)' }}>
                radio_button_unchecked
              </span>
              <span className="text-[12px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}>
                미완료 할일
              </span>
            </div>
            <div className="space-y-2">
              {incompleteTodos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-2 py-1">
                  <span className="material-symbols-outlined text-[16px]"
                    style={{ color: 'var(--color-text-light)' }}>
                    radio_button_unchecked
                  </span>
                  <span className="text-[14px] font-medium"
                    style={{ color: 'var(--color-text-muted)' }}>
                    {todo.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 습관 달성 */}
        {habits.length > 0 && (
          <div className="rounded-[28px] border p-5"
            style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[16px]">🔥</span>
              <span className="text-[12px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}>
                습관 달성
              </span>
            </div>
            <div className="space-y-2">
              {dayHabits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px]">{habit.icon}</span>
                    <span className="text-[14px] font-medium"
                      style={{ color: habit.isCompleted ? 'var(--color-text)' : 'var(--color-text-light)' }}>
                      {habit.title}
                    </span>
                  </div>
                  <span className="text-[12px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: habit.isCompleted ? 'var(--color-tertiary-container)' : 'var(--color-surface-container)',
                      color: habit.isCompleted ? 'var(--color-tertiary)' : 'var(--color-text-light)',
                    }}>
                    {habit.isCompleted ? '달성 ✓' : '미달성'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 집중 세션 */}
        {daySessions.length > 0 && (
          <div className="rounded-[28px] border p-5"
            style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px]"
                style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                timer
              </span>
              <span className="text-[12px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}>
                집중 세션
              </span>
            </div>
            <div className="space-y-2">
              {daySessions.map((session, idx) => {
                const linkedTodo = todos.find((t) => t.id === session.todoId)
                return (
                  <div key={session.id} className="flex items-center justify-between py-1 border-b last:border-b-0"
                    style={{ borderColor: 'var(--color-primary-container)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
                        #{idx + 1}
                      </span>
                      <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
                        {linkedTodo ? linkedTodo.title : '자유 집중'}
                      </span>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: 'var(--color-primary)' }}>
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
          <div className="flex flex-col items-center justify-center py-16"
            style={{ color: 'var(--color-text-light)' }}>
            <span className="text-[48px] mb-3">📅</span>
            <p className="font-bold text-[15px]">이 날의 기록이 없어요</p>
            <p className="text-[13px] mt-1">할일을 추가하거나 로그를 작성해보세요!</p>
          </div>
        )}

      </main>
    </>
  )
}
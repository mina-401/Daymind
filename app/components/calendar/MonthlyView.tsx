import { useState } from 'react'
import { useTodoStore } from '../../store/todoStore'
import TodoItem from '../todo/TodoItem'
import TodoModal from '../todo/TodoModal'
import type { Todo } from '../../types'
import DraggableButton from '../ui/DraggableButton'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

function getCalendarDates(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const prevLastDate = new Date(year, month, 0).getDate()
  const dates: { date: number; month: 'prev' | 'current' | 'next' }[] = []

  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({ date: prevLastDate - i, month: 'prev' })
  }
  for (let i = 1; i <= lastDate; i++) {
    dates.push({ date: i, month: 'current' })
  }
  const remaining = 42 - dates.length
  for (let i = 1; i <= remaining; i++) {
    dates.push({ date: i, month: 'next' })
  }
  return dates
}

function toDateString(year: number, month: number, date: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
}

export default function MonthlyView() {
  const { todos } = useTodoStore()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTodo, setEditTodo] = useState<Todo | null>(null)

  const calendarDates = getCalendarDates(currentYear, currentMonth)
  const selectedTodos = todos.filter((t) => t.date === selectedDate)
  const untimedTodos = selectedTodos.filter((t) => !t.startTime)

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentYear(currentYear - 1); setCurrentMonth(11) }
    else setCurrentMonth(currentMonth - 1)
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentYear(currentYear + 1); setCurrentMonth(0) }
    else setCurrentMonth(currentMonth + 1)
  }

  const handleEdit = (todo: Todo) => { setEditTodo(todo); setIsModalOpen(true) }
  const handleClose = () => { setIsModalOpen(false); setEditTodo(null) }

  const selectedDateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('ko-KR', {
    month: 'long', day: 'numeric', weekday: 'long',
  })

  return (
    <>
      {/* 캘린더 카드 */}
      <div className="rounded-[32px] overflow-hidden mb-4 shadow-sm border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>

        {/* 월 이동 */}
        <div className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-primary-container)' }}>
          <button
            onClick={handlePrevMonth}
            className="bouncy-button w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-primary)' }}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="font-bold text-[16px]" style={{ color: 'var(--color-primary)' }}>
            {currentYear}년 {currentMonth + 1}월
          </span>
          <button
            onClick={handleNextMonth}
            className="bouncy-button w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-primary)' }}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b"
          style={{ borderColor: 'var(--color-primary-container)' }}>
          {DAYS.map((day, i) => (
            <div key={day} className="py-2 text-center text-[12px] font-bold"
              style={{
                color: i === 0 ? '#ba1a1a' :
                       i === 6 ? 'var(--color-primary)' :
                       'var(--color-text-muted)'
              }}>
              {day}
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className="grid grid-cols-7 p-2">
          {calendarDates.map((item, idx) => {
            const dateStr = item.month === 'current'
              ? toDateString(currentYear, currentMonth, item.date)
              : item.month === 'prev'
              ? toDateString(currentYear, currentMonth - 1, item.date)
              : toDateString(currentYear, currentMonth + 1, item.date)

            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate
            const hasTodos = todos.some((t) => t.date === dateStr)
            const completedAll = hasTodos && todos.filter((t) => t.date === dateStr).every((t) => t.isCompleted)
            const col = idx % 7

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(dateStr)}
                className="flex flex-col items-center py-1.5 gap-1"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-bold transition-all"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-primary)' :
                                     isToday ? 'var(--color-primary-container)' :
                                     'transparent',
                    color: isSelected ? 'white' :
                           isToday ? 'var(--color-primary)' :
                           item.month !== 'current' ? 'var(--color-text-light)' :
                           col === 0 ? '#ba1a1a' :
                           col === 6 ? 'var(--color-primary)' :
                           'var(--color-text)',
                  }}>
                  {item.date}
                </div>
                <div className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: hasTodos
                      ? completedAll ? 'var(--color-tertiary)' : 'var(--color-primary-light)'
                      : 'transparent'
                  }} />
              </button>
            )
          })}
        </div>
      </div>

      {/* 선택한 날 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-[15px]" style={{ color: 'var(--color-text)' }}>
            {selectedDateLabel}
          </span>
          <span className="text-[12px] font-bold"
            style={{ color: 'var(--color-text-muted)' }}>
            {selectedTodos.filter((t) => t.isCompleted).length} / {selectedTodos.length}
          </span>
        </div>

        {/* 할일 목록 */}
        {selectedTodos.length > 0 && (
          <div className="space-y-3">
            {selectedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onEdit={handleEdit} />
            ))}
          </div>
        )}

        {/* 할일 없을 때 */}
        {selectedTodos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12"
            style={{ color: 'var(--color-text-light)' }}>
            <span className="material-symbols-outlined text-[48px] mb-3"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              calendar_today
            </span>
            <p className="font-bold text-[14px]">이 날은 할 일이 없어요</p>
            <p className="text-[12px] mt-1">+ 버튼으로 추가해보세요!</p>
          </div>
        )}
      </div>

      <DraggableButton
        onClick={() => setIsModalOpen(true)}
        storageKey="daymind-btn-calendar"
      >
        <span className="material-symbols-outlined text-white text-[28px]">add</span>
      </DraggableButton>

      <TodoModal
        isOpen={isModalOpen}
        onClose={handleClose}
        editTodo={editTodo}
        date={selectedDate}
      />
    </>
  )
}
import { useState } from 'react'
import { useTodoStore } from '../../store/todoStore'
import TodoItem from '../todo/TodoItem'
import TodoModal from '../todo/TodoModal'
import type { Todo } from '../../types'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

function getCalendarDates(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const prevLastDate = new Date(year, month, 0).getDate()

  const dates: { date: number; month: 'prev' | 'current' | 'next' }[] = []

  // 이전달 날짜
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({ date: prevLastDate - i, month: 'prev' })
  }
  // 현재달 날짜
  for (let i = 1; i <= lastDate; i++) {
    dates.push({ date: i, month: 'current' })
  }
  // 다음달 날짜
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

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditTodo(null)
  }

  // 선택 날짜 포맷 "4월 30일"
  const selectedDateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#eee] overflow-hidden mb-4">

        {/* 월 이동 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#f5f5f5]">
          <button
            onClick={handlePrevMonth}
            className="bouncy-button w-9 h-9 rounded-xl flex items-center justify-center text-[#a4a4c4] hover:bg-[#f5f5f5]"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="font-bold text-[16px] text-[#4a443a]">
            {currentYear}년 {currentMonth + 1}월
          </span>
          <button
            onClick={handleNextMonth}
            className="bouncy-button w-9 h-9 rounded-xl flex items-center justify-center text-[#a4a4c4] hover:bg-[#f5f5f5]"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-[#f5f5f5]">
          {DAYS.map((day, i) => (
            <div key={day} className={`py-2 text-center text-[12px] font-bold ${
              i === 0 ? 'text-red-400' :
              i === 6 ? 'text-blue-400' :
              'text-[#a4a4c4]'
            }`}>
              {day}
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className="grid grid-cols-7">
          {calendarDates.map((item, idx) => {
            const dateStr = item.month === 'current'
              ? toDateString(currentYear, currentMonth, item.date)
              : item.month === 'prev'
              ? toDateString(currentYear, currentMonth - 1, item.date)
              : toDateString(currentYear, currentMonth + 1, item.date)

            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate
            const hasTodos = todos.some((t) => t.date === dateStr)
            const col = idx % 7

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(dateStr)}
                className="flex flex-col items-center py-2 gap-1"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-bold transition-all ${
                  isSelected
                    ? 'bg-[#a4a4c4] text-white'
                    : isToday
                    ? 'bg-[#eee8d5] text-[#8c7a2e] border border-[#dcd7c5]'
                    : item.month !== 'current'
                    ? 'text-[#d4d0c8]'
                    : col === 0
                    ? 'text-red-400'
                    : col === 6
                    ? 'text-blue-400'
                    : 'text-[#4a443a]'
                }`}>
                  {item.date}
                </div>
                <div className={`w-1 h-1 rounded-full ${
                  hasTodos ? 'bg-[#a4a4c4]' : 'bg-transparent'
                }`} />
              </button>
            )
          })}
        </div>
      </div>

      {/* 선택한 날 할일 목록 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-[15px] text-[#4a443a]">
            {selectedDateLabel} 할 일
          </span>
          <span className="text-[12px] text-[#a4a4c4] font-bold">
            {selectedTodos.filter((t) => t.isCompleted).length} / {selectedTodos.length}
          </span>
        </div>

        {/* 할일 목록 */}
        {selectedTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-[#a4a4c4]">
            <span className="material-symbols-outlined text-[40px] mb-2"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <p className="font-bold text-[14px]">할 일이 없어요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {/* 추가 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bouncy-button fixed bottom-28 right-5 w-14 h-14 bg-[#a4a4c4] rounded-2xl flex items-center justify-center shadow-lg"
      >
        <span className="material-symbols-outlined text-white text-[28px]">add</span>
      </button>

      {/* 모달 */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleClose}
        editTodo={editTodo}
        date={selectedDate}
      />
    </>
  )
}
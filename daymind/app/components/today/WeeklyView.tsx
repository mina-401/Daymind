import { useState } from 'react'
import { useTodoStore } from '../../store/todoStore'
import EnergyTag from '../ui/EnergyTag'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const HOURS = Array.from({ length: 24 }, (_, i) => i) // 0~23

function getWeekDates() {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  // 월요일 기준으로 조정
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function toDateString(date: Date) {
  return date.toISOString().split('T')[0]
}

export default function WeeklyView() {
  const { todos } = useTodoStore()
  const weekDates = getWeekDates()
  const todayStr = toDateString(new Date())

  const [selectedDate, setSelectedDate] = useState(todayStr)

  const selectedTodos = todos.filter((t) => t.date === selectedDate)
  const timedTodos = selectedTodos.filter((t) => t.startTime)
  const untimedTodos = selectedTodos.filter((t) => !t.startTime)

  return (
    <div>
      {/* 날짜 바 */}
      <div className="flex justify-between mb-5">
        {weekDates.map((date, i) => {
          const dateStr = toDateString(date)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const hasTodos = todos.some((t) => t.date === dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className="flex flex-col items-center gap-1"
            >
              <span className={`text-[11px] font-bold ${
                i === 5 ? 'text-blue-400' :
                i === 6 ? 'text-red-400' :
                'text-[#a4a4c4]'
              }`}>
                {DAYS[i]}
              </span>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[14px] font-bold transition-all ${
                isSelected
                  ? 'bg-[#a4a4c4] text-white'
                  : isToday
                  ? 'bg-[#eee8d5] text-[#8c7a2e] border border-[#dcd7c5]'
                  : 'text-[#4a443a]'
              }`}>
                {date.getDate()}
              </div>
              {/* 할일 있는 날 점 표시 */}
              <div className={`w-1 h-1 rounded-full ${hasTodos ? 'bg-[#a4a4c4]' : 'transparent'}`} />
            </button>
          )
        })}
      </div>

      {/* 시간 미정 영역 */}
      {untimedTodos.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-[#eee] mb-4">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="material-symbols-outlined text-[16px] text-[#a4a4c4]">schedule</span>
            <span className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider">시간 미정</span>
          </div>
          <div className="space-y-2">
            {untimedTodos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  todo.isCompleted ? 'bg-[#a4a4c4] border-[#a4a4c4]' : 'border-[#dcd7c5]'
                }`} />
                <span className={`text-[14px] font-medium flex-grow ${
                  todo.isCompleted ? 'line-through text-[#a4a4c4]' : 'text-[#4a443a]'
                }`}>
                  {todo.title}
                </span>
                <EnergyTag energy={todo.energy} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 타임블록 영역 */}
      <div className="bg-white rounded-2xl border border-[#eee] overflow-hidden">
        {HOURS.map((hour) => {
          const hourStr = String(hour).padStart(2, '0') + ':00'
          const blockTodos = timedTodos.filter((t) => t.startTime?.startsWith(String(hour).padStart(2, '0')))

          return (
            <div key={hour} className="flex gap-3 px-4 min-h-[52px] border-b border-[#f5f5f5] last:border-b-0">
              {/* 시간 라벨 */}
              <div className="w-12 flex-shrink-0 flex items-start pt-3">
                <span className="text-[11px] font-bold text-[#c4bfb4]">{hourStr}</span>
              </div>

              {/* 블록 영역 */}
              <div className="flex-grow py-2 flex flex-col gap-1.5">
                {blockTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`rounded-xl px-3 py-2 border ${
                      todo.isCompleted
                        ? 'bg-[#f5f5f5] border-[#eee] opacity-60'
                        : todo.energy === 'high'
                        ? 'bg-red-50 border-red-200'
                        : todo.energy === 'medium'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[13px] font-bold ${
                        todo.isCompleted ? 'line-through text-[#a4a4c4]' : 'text-[#4a443a]'
                      }`}>
                        {todo.title}
                      </span>
                      <EnergyTag energy={todo.energy} />
                    </div>
                    {todo.startTime && (
                      <span className="text-[11px] text-[#a4a4c4] mt-0.5 block">
                        {todo.startTime}{todo.endTime ? ` ~ ${todo.endTime}` : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 할일 없을 때 */}
      {selectedTodos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-[#a4a4c4]">
          <span className="material-symbols-outlined text-[48px] mb-3"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            calendar_today
          </span>
          <p className="font-bold text-[15px]">이 날은 할 일이 없어요</p>
        </div>
      )}
    </div>
  )
}
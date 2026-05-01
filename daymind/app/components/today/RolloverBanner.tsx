import { useState } from 'react'
import type { Todo } from '../../types'

type Props = {
  todos: Todo[]
}

export default function RolloverBanner({ todos }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const rolloverTodos = todos.filter((t) => t.rolledOver && !t.isCompleted)

  if (rolloverTodos.length === 0) return null

  return (
    <div className="bg-[#fff8e7] border border-[#f0d88a] rounded-2xl overflow-hidden">
      
      {/* 헤더 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-yellow-500"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            history
          </span>
          <span className="font-bold text-[13px] text-yellow-700">
            어제 미완료 {rolloverTodos.length}개 이월됨
          </span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-yellow-500 transition-transform"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          expand_more
        </span>
      </button>

      {/* 펼쳐지는 목록 */}
      {isExpanded && (
        <div className="px-4 pb-3 space-y-2 border-t border-[#f0d88a]">
          {rolloverTodos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2 py-1.5">
              <span className="material-symbols-outlined text-[14px] text-yellow-400">
                radio_button_unchecked
              </span>
              <span className="text-[13px] font-medium text-yellow-800">
                {todo.title}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
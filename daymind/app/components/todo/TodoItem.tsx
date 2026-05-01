import type { Todo } from '../../types'
import EnergyTag from '../ui/EnergyTag'
import { useTodoStore } from '../../store/todoStore'

type Props = {
  todo: Todo
  onEdit: (todo: Todo) => void
}

export default function TodoItem({ todo, onEdit }: Props) {
  const { toggleTodo, deleteTodo } = useTodoStore()

  return (
    <div className={`bg-white rounded-2xl p-4 border border-[#eee] flex items-center gap-4 transition-opacity ${todo.isCompleted ? 'opacity-50' : ''}`}>
      
      {/* 체크박스 */}
      <button
        onClick={() => toggleTodo(todo.id)}
        className="bouncy-button flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#dcd7c5] flex items-center justify-center"
        style={{ backgroundColor: todo.isCompleted ? '#a4a4c4' : 'transparent' }}
      >
        {todo.isCompleted && (
           <img
              src="/icons/fi-rs-check.png"
              alt="check"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
        )}
      </button>

      {/* 내용 */}
      <div className="flex-grow">
        <p className={`font-bold text-[15px] ${todo.isCompleted ? 'line-through text-[#a4a4c4]' : 'text-[#4a443a]'}`}>
          {todo.title}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <EnergyTag energy={todo.energy} />
          {todo.rolledOver && (
            <span className="text-[11px] font-bold text-[#a4a4c4] flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">history</span>
              이월
            </span>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(todo)}
          className="p-2 rounded-xl text-[#a4a4c4] hover:bg-[#eee8d5] transition-colors"
        >
          <img
            src="/icons/fi-rs-pencil.png"
            alt="edit"
            className="w-5 h-5 opacity-60 hover:opacity-100"
          />
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="p-2 rounded-xl text-[#a4a4c4] hover:bg-red-50 hover:text-red-400 transition-colors"
        >
          <img
            src="/icons/fi-rs-cross-small.png"
            alt="delete"
            className="w-5 h-5 opacity-60 hover:opacity-100"
          />
        </button>
      </div>

    </div>
  )
}
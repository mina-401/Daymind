import type { Todo } from '../../types'
import EnergyTag from '../ui/EnergyTag'
import { useTodoStore } from '../../store/todoStore'

type Props = {
  todo: Todo
  onEdit: (todo: Todo) => void
}

export default function TodoItem({ todo, onEdit }: Props) {
  const { toggleTodo, deleteTodo } = useTodoStore()

  const energyIcon = {
    high: 'swords',
    medium: 'eco',
    low: 'exercise',
  }[todo.energy]

  const energyBg = {
    high: 'var(--color-error-container)',
    medium: '#f9e287',
    low: 'var(--color-tertiary-container)',
  }[todo.energy]

  const energyColor = {
    high: 'var(--color-error)',
    medium: '#534600',
    low: 'var(--color-tertiary)',
  }[todo.energy]

  if (todo.isCompleted) {
    return (
      <div
        className="rounded-[28px] p-4 flex items-center gap-4 border-2 border-dashed opacity-80"
        style={{ backgroundColor: 'var(--color-surface-container)', borderColor: 'var(--color-text-light)' }}
      >
        {/* 아이콘 */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-surface-dim)' }}>
          <span className="material-symbols-outlined text-[28px]"
            style={{ color: 'var(--color-text-muted)', fontVariationSettings: "'FILL' 1" }}>
            {energyIcon}
          </span>
        </div>

        {/* 내용 */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-bold text-[15px] truncate line-through"
              style={{ color: 'var(--color-text-muted)' }}>
              {todo.title}
            </span>
            <EnergyTag energy={todo.energy} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-grow h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--color-surface-dim)' }}>
              <div className="h-full w-full rounded-full"
                style={{ backgroundColor: 'var(--color-text-muted)' }} />
            </div>
            <span className="text-[11px] font-bold flex-shrink-0"
              style={{ color: 'var(--color-text-muted)' }}>
              1/1
            </span>
          </div>
        </div>

        {/* DONE 뱃지 */}
        <button
          onClick={() => toggleTodo(todo.id)}
          className="bouncy-button flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-[13px]"
          style={{ backgroundColor: 'var(--color-surface-dim)', color: 'var(--color-text-muted)' }}
        >
          <span className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            pets
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="quest-card p-4 flex items-center gap-4">

      {/* 아이콘 */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: energyBg }}>
        <span className="material-symbols-outlined text-[28px]"
          style={{ color: energyColor, fontVariationSettings: "'FILL' 1" }}>
          {energyIcon}
        </span>
      </div>

      {/* 내용 */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-bold text-[15px] truncate"
            style={{ color: 'var(--color-text)' }}>
            {todo.title}
          </span>
          <EnergyTag energy={todo.energy} />
        </div>

        {/* 진행바 */}
        <div className="flex items-center gap-2">
          <div className="progress-track flex-grow h-2">
            <div className="h-full w-0 rounded-full" />
          </div>
          <span className="text-[11px] font-bold flex-shrink-0"
            style={{ color: 'var(--color-text-muted)' }}>
            0/1
          </span>
        </div>

        {/* 이월 태그 */}
        {todo.rolledOver && (
          <span className="text-[11px] font-bold mt-1 flex items-center gap-0.5"
            style={{ color: 'var(--color-text-light)' }}>
            <span className="material-symbols-outlined text-[12px]">history</span>
            이월
          </span>
        )}
      </div>

      {/* 체크 버튼 + 액션 */}
      <div className="flex flex-col gap-1.5 flex-shrink-0 items-center">
        <button
          onClick={() => toggleTodo(todo.id)}
          className="bouncy-button w-12 h-12 font-bold rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
          }}
        >
          <span className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            pets
          </span>
        </button>

        <div className="flex gap-1 justify-center">
          <button
            onClick={() => onEdit(todo)}
            className="w-5 h-5 flex items-center justify-center"
            style={{ color: 'var(--color-text-light)' }}
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="w-5 h-5 flex items-center justify-center"
            style={{ color: 'var(--color-text-light)' }}
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </button>
        </div>
      </div>

    </div>
  )
}
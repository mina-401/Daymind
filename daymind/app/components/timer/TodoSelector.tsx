import { useTodoStore } from '../../store/todoStore'
import { useTimerStore } from '../../store/timerStore'

export default function TodoSelector() {
  const { todos } = useTodoStore()
  const { selectedTodoId, selectTodo } = useTimerStore()

  const today = new Date().toISOString().split('T')[0]
  const todayTodos = todos.filter((t) => t.date === today && !t.isCompleted)

  return (
    <div className="rounded-[28px] border p-4 mb-4 shadow-sm"
      style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>
      <label className="text-[12px] font-bold uppercase tracking-wider mb-2 block"
        style={{ color: 'var(--color-text-muted)' }}>
        집중할 할 일
      </label>
      <select
        value={selectedTodoId ?? ''}
        onChange={(e) => selectTodo(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-[14px] font-medium outline-none border-2"
        style={{
          backgroundColor: 'var(--color-surface-container)',
          borderColor: 'var(--color-primary-container)',
          color: 'var(--color-text)',
        }}
      >
        <option value="">선택 안함</option>
        {todayTodos.map((todo) => (
          <option key={todo.id} value={todo.id}>
            {todo.title}
          </option>
        ))}
      </select>
    </div>
  )
}
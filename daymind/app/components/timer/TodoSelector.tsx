import { useTodoStore } from '../../store/todoStore'
import { useTimerStore } from '../../store/timerStore'

export default function TodoSelector() {
  const { todos } = useTodoStore()
  const { selectedTodoId, selectTodo } = useTimerStore()

  const today = new Date().toISOString().split('T')[0]
  const todayTodos = todos.filter((t) => t.date === today && !t.isCompleted)

  return (
    <div className="bg-white rounded-2xl border border-[#eee] p-4 mb-4">
      <label className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider mb-2 block">
        집중할 할 일
      </label>
      <select
        value={selectedTodoId ?? ''}
        onChange={(e) => selectTodo(e.target.value)}
        className="w-full bg-[#f7f4e9] border border-[#eee] rounded-xl px-4 py-3 text-[14px] font-medium text-[#4a443a] outline-none"
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
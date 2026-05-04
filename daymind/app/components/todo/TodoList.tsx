import type { Todo } from '../../types'
import TodoItem from './TodoItem'

type Props = {
  todos: Todo[]
  onEdit: (todo: Todo) => void
}

export default function TodoList({ todos, onEdit }: Props) {
  const incompleteTodos = todos.filter((t) => !t.isCompleted)
  const completedTodos = todos.filter((t) => t.isCompleted)

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#a4a4c4]">
        <img
          src="/icons/fi-rr-apps-add.png"
          alt="add"
          className="w-5 h-5 opacity-60 mb-5 hover:opacity-100"
        />
        <p className="font-bold text-[15px]">오늘 할 일이 없어요</p>
        <p className="text-[13px] mb-20 mt-1"> + 버튼으로 추가해보세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* 미완료 목록 */}
      {incompleteTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
      ))}

      {/* 완료 목록 */}
      {completedTodos.length > 0 && (
        <>
          <div className="flex items-center gap-2 py-2">
            <div className="flex-grow h-px bg-[#eee]" />
            <span className="text-[11px] font-bold text-[#a4a4c4]">
              완료 {completedTodos.length}개
            </span>
            <div className="flex-grow h-px bg-[#eee]" />
          </div>
          {completedTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onEdit={onEdit} />
          ))}
        </>
      )}
    </div>
  )
}
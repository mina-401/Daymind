import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Todo, EnergyLevel } from '../types'

type TodoStore = {
  todos: Todo[]

  // 추가
  addTodo: (title: string, date: string, energy: EnergyLevel, startTime?: string, endTime?: string) => void
  // 완료 토글
  toggleTodo: (id: string) => void
  // 수정
  updateTodo: (id: string, updates: Partial<Todo>) => void
  // 삭제
  deleteTodo: (id: string) => void
  // 이월 처리
  rolloverTodos: () => void
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],

      addTodo: (title, date, energy, startTime, endTime) => {
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          title,
          date,
          isCompleted: false,
          energy,
          rolledOver: false,
          startTime,
          endTime,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ todos: [...state.todos, newTodo] }))
      },
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
          ),
        }))
      },

      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        }))
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }))
      },

      rolloverTodos: () => {
        const today = new Date().toISOString().split('T')[0]
        set((state) => ({
          todos: state.todos.map((todo) => {
            // 오늘 이전 날짜이고 미완료인 항목 → 오늘 날짜로 이월
            if (!todo.isCompleted && todo.date < today) {
              return { ...todo, date: today, rolledOver: true }
            }
            return todo
          }),
        }))
      },
    }),
    {
      name: 'myrutine-todos', // LocalStorage 키
    }
  )
)
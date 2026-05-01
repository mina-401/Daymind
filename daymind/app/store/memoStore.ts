import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Memo } from '../types'

type MemoStore = {
  memos: Memo[]

  addMemo: (title: string, content: string) => void
  updateMemo: (id: string, updates: Partial<Memo>) => void
  deleteMemo: (id: string) => void
  linkMemoToTodo: (memoId: string, todoId: string) => void
}

export const useMemoStore = create<MemoStore>()(
  persist(
    (set) => ({
      memos: [],

      addMemo: (title, content) => {
        const newMemo: Memo = {
          id: crypto.randomUUID(),
          title,
          content,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ memos: [...state.memos, newMemo] }))
      },

      updateMemo: (id, updates) => {
        set((state) => ({
          memos: state.memos.map((memo) =>
            memo.id === id
              ? { ...memo, ...updates, updatedAt: new Date().toISOString() }
              : memo
          ),
        }))
      },

      deleteMemo: (id) => {
        set((state) => ({
          memos: state.memos.filter((memo) => memo.id !== id),
        }))
      },

      linkMemoToTodo: (memoId, todoId) => {
        set((state) => ({
          memos: state.memos.map((memo) =>
            memo.id === memoId ? { ...memo, linkedTodoId: todoId } : memo
          ),
        }))
      },
    }),
    {
      name: 'myrutine-memos',
    }
  )
)
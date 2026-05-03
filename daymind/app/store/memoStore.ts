import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Memo } from '../types'

type MemoStore = {
  memos: Memo[]

  addMemo: (title: string, content: string, date?: string) => string
  updateMemo: (id: string, updates: Partial<Memo>) => void
  deleteMemo: (id: string) => void
  linkMemoToTodo: (memoId: string, todoId: string) => void

  // 날짜별 메모 찾기 (없으면 자동 생성)
  getOrCreateDailyMemo: (date: string) => string
}

export const useMemoStore = create<MemoStore>()(
  persist(
    (set, get) => ({
      memos: [],

      addMemo: (title, content, date) => {
        const id = crypto.randomUUID()
        const newMemo: Memo = {
          id,
          title,
          content,
          date,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ memos: [...state.memos, newMemo] }))
        return id
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

      getOrCreateDailyMemo: (date) => {
        const { memos, addMemo } = get()
        const existing = memos.find((m) => m.date === date)
        if (existing) return existing.id

        // 없으면 자동 생성
        const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('ko-KR', {
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })
        return addMemo(`${dateLabel} 로그`, '', date)
      },
    }),
    {
      name: 'myrutine-memos',
    }
  )
)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimerSession } from '../types'

type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

type TimerStore = {
  // 타이머 상태
  status: TimerStatus
  secondsLeft: number
  duration: number        // 기본 25분
  selectedTodoId?: string
  sessions: TimerSession[]

  // 액션
  start: (todoId?: string) => void
  pause: () => void
  resume: () => void
  reset: () => void
  tick: () => void        // 1초씩 감소
  finish: () => void      // 타이머 완료
  setDuration: (minutes: number) => void
  selectTodo: (todoId: string) => void
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      status: 'idle',
      secondsLeft: 25 * 60,
      duration: 25 * 60,
      selectedTodoId: undefined,
      sessions: [],

      start: (todoId) => {
        set({
          status: 'running',
          selectedTodoId: todoId,
        })
      },

      pause: () => {
        set({ status: 'paused' })
      },

      resume: () => {
        set({ status: 'running' })
      },

      reset: () => {
        set((state) => ({
          status: 'idle',
          secondsLeft: state.duration,
          selectedTodoId: undefined,
        }))
      },

      tick: () => {
        const { secondsLeft, finish } = get()
        if (secondsLeft <= 1) {
          finish()
        } else {
          set((state) => ({ secondsLeft: state.secondsLeft - 1 }))
        }
      },

      finish: () => {
        const { selectedTodoId, duration } = get()
        const newSession: TimerSession = {
          id: crypto.randomUUID(),
          todoId: selectedTodoId,
          duration,
          completedAt: new Date().toISOString(),
        }
        set((state) => ({
          status: 'finished',
          secondsLeft: 0,
          sessions: [...state.sessions, newSession],
        }))
      },

      setDuration: (minutes) => {
        set({
          duration: minutes * 60,
          secondsLeft: minutes * 60,
          status: 'idle',
        })
      },

      selectTodo: (todoId) => {
        set({ selectedTodoId: todoId })
      },
    }),
    {
      name: 'myrutine-timer',
      partialize: (state) => ({ sessions: state.sessions }), // 세션 기록만 저장
    }
  )
)
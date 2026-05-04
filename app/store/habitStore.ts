import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Habit, HabitRecord } from '../types'

type HabitStore = {
  habits: Habit[]
  records: HabitRecord[]

  // 습관 추가
  addHabit: (title: string, icon: string) => void
  // 습관 삭제
  deleteHabit: (id: string) => void
  // 오늘 습관 체크/해제
  toggleHabitRecord: (habitId: string, date: string) => void
  // 특정 날짜 습관 완료 여부
  isCompleted: (habitId: string, date: string) => boolean
  // 스트릭 계산
  getStreak: (habitId: string) => number
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      records: [],

      addHabit: (title, icon) => {
        const newHabit: Habit = {
          id: crypto.randomUUID(),
          title,
          icon,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ habits: [...state.habits, newHabit] }))
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          records: state.records.filter((r) => r.habitId !== id),
        }))
      },

      toggleHabitRecord: (habitId, date) => {
        const { records } = get()
        const existing = records.find(
          (r) => r.habitId === habitId && r.date === date
        )
        if (existing) {
          // 이미 있으면 토글
          set((state) => ({
            records: state.records.map((r) =>
              r.habitId === habitId && r.date === date
                ? { ...r, isCompleted: !r.isCompleted }
                : r
            ),
          }))
        } else {
          // 없으면 새로 생성
          const newRecord: HabitRecord = {
            id: crypto.randomUUID(),
            habitId,
            date,
            isCompleted: true,
          }
          set((state) => ({ records: [...state.records, newRecord] }))
        }
      },

      isCompleted: (habitId, date) => {
        const { records } = get()
        return records.some(
          (r) => r.habitId === habitId && r.date === date && r.isCompleted
        )
      },

      getStreak: (habitId) => {
        const { records } = get()
        const completed = records
          .filter((r) => r.habitId === habitId && r.isCompleted)
          .map((r) => r.date)
          .sort()
          .reverse()

        if (completed.length === 0) return 0

        let streak = 0
        const today = new Date()

        for (let i = 0; i < 365; i++) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          const dateStr = d.toISOString().split('T')[0]

          if (completed.includes(dateStr)) {
            streak++
          } else {
            // 오늘 아직 안 했으면 계속 체크
            if (i === 0) continue
            break
          }
        }
        return streak
      },
    }),
    {
      name: 'myrutine-habits',
    }
  )
)
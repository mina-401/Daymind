import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Routine, Stage, StageRecord } from '../types'

type RoutineStore = {
  routines: Routine[]
  records: StageRecord[]

  addRoutine: (title: string, targetDays: number) => string
  deleteRoutine: (id: string) => void
  updateRoutine: (id: string, updates: Partial<Routine>) => void

  addStage: (routineId: string, stage: Omit<Stage, 'id' | 'createdAt'>) => void
  updateStage: (routineId: string, stageId: string, updates: Partial<Stage>) => void
  deleteStage: (routineId: string, stageId: string) => void

  toggleStageRecord: (stageId: string, date: string) => void
  isStageCompleted: (stageId: string, date: string) => boolean
  getStageStreak: (stageId: string) => number
  getStageCount: (stageId: string) => number
  isStageUnlocked: (routineId: string, stageId: string) => boolean
  getTotalXP: (routineId: string) => number
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: [],
      records: [],

      addRoutine: (title, targetDays) => {
        const id = crypto.randomUUID()
        const newRoutine: Routine = {
          id,
          title,
          targetDays,
          stages: [],
          totalXP: 0,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ routines: [...state.routines, newRoutine] }))
        return id
      },

      deleteRoutine: (id) => {
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
          records: state.records.filter((r) => {
            const routine = state.routines.find((rt) => rt.id === id)
            return !routine?.stages.some((s) => s.id === r.stageId)
          }),
        }))
      },

      updateRoutine: (id, updates) => {
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }))
      },

      addStage: (routineId, stage) => {
        const newStage: Stage = {
          ...stage,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === routineId
              ? { ...r, stages: [...r.stages, newStage] }
              : r
          ),
        }))
      },

      updateStage: (routineId, stageId, updates) => {
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === routineId
              ? { ...r, stages: r.stages.map((s) => s.id === stageId ? { ...s, ...updates } : s) }
              : r
          ),
        }))
      },

      deleteStage: (routineId, stageId) => {
        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === routineId
              ? { ...r, stages: r.stages.filter((s) => s.id !== stageId) }
              : r
          ),
          records: state.records.filter((r) => r.stageId !== stageId),
        }))
      },

      toggleStageRecord: (stageId, date) => {
        const { records } = get()
        const existing = records.find((r) => r.stageId === stageId && r.date === date)
        if (existing) {
          set((state) => ({
            records: state.records.map((r) =>
              r.stageId === stageId && r.date === date
                ? { ...r, isCompleted: !r.isCompleted }
                : r
            ),
          }))
        } else {
          const newRecord: StageRecord = {
            id: crypto.randomUUID(),
            stageId,
            date,
            isCompleted: true,
          }
          set((state) => ({ records: [...state.records, newRecord] }))
        }
      },

      isStageCompleted: (stageId, date) => {
        const { records } = get()
        return records.some((r) => r.stageId === stageId && r.date === date && r.isCompleted)
      },

      getStageStreak: (stageId) => {
        const { records } = get()
        const completed = records
          .filter((r) => r.stageId === stageId && r.isCompleted)
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
            if (i === 0) continue
            break
          }
        }
        return streak
      },

      getStageCount: (stageId) => {
        const { records } = get()
        return records.filter((r) => r.stageId === stageId && r.isCompleted).length
      },

      isStageUnlocked: (routineId, stageId) => {
        const { routines, isStageCompleted } = get()
        const today = new Date().toISOString().split('T')[0]
        const routine = routines.find((r) => r.id === routineId)
        if (!routine) return false

        const stage = routine.stages.find((s) => s.id === stageId)
        if (!stage) return false

        // order 0 이면 항상 해금
        if (stage.order === 0) return true

        // 이전 order 스테이지들을 오늘 체크했으면 해금
        const prevStages = routine.stages.filter((s) => s.order === stage.order - 1)
        return prevStages.every((s) => isStageCompleted(s.id, today))
      },

      getTotalXP: (routineId) => {
        const { routines, getStageCount } = get()
        const routine = routines.find((r) => r.id === routineId)
        if (!routine) return 0

        return routine.stages.reduce((total, stage) => {
          const count = getStageCount(stage.id)
          if (count >= routine.targetDays) {
            return total + stage.rewardXP
          }
          return total
        }, 0)
      },
    }),
    {
      name: 'daymind-routines',
    }
  )
)
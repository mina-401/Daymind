import { useState } from 'react'
import { useRoutineStore } from '../../store/routineStore'
import StageCard from './StageCard'
import type { Stage } from '../../types'

type Props = {
  onAddStage: (routineId: string, order: number, parallelGroup?: string) => void
  onEditStage: (routineId: string, stage: Stage) => void
}

export default function RoutineMap({ onAddStage, onEditStage }: Props) {
  const { routines, records, addRoutine, deleteRoutine, isStageUnlocked, getTotalXP } = useRoutineStore()
  const [newRoutineTitle, setNewRoutineTitle] = useState('')
const [newRoutineTargetDays, setNewRoutineTargetDays] = useState('7')
const [isAddingRoutine, setIsAddingRoutine] = useState(false)
const [weekPage, setWeekPage] = useState<Record<string, number>>({}) 

  const handleAddRoutine = () => {
    if (!newRoutineTitle.trim()) return
    const days = parseInt(newRoutineTargetDays)
    if (!days || days < 1) return
    addRoutine(newRoutineTitle, days)
    setNewRoutineTitle('')
    setNewRoutineTargetDays('7')
    setIsAddingRoutine(false)
  }

  if (routines.length === 0 && !isAddingRoutine) {
    return (
      <div className="flex flex-col items-center justify-center py-16"
        style={{ color: 'var(--color-text-light)' }}>
        <span className="text-[48px] mb-3">🗺️</span>
        <p className="font-bold text-[15px]">나만의 루틴을 만들어보세요!</p>
        <p className="text-[13px] mt-1">새로운 루틴을 추가해보세요</p>
        <button
          onClick={() => setIsAddingRoutine(true)}
          className="bouncy-button mt-4 font-bold px-6 py-3 rounded-2xl text-[13px] text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          + 루틴 만들기
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* 루틴 목록 */}
      {routines.map((routine) => {
        const totalXP = getTotalXP(routine.id)
        const maxOrder = Math.max(...routine.stages.map((s) => s.order), -1)
        const orderGroups = Array.from({ length: maxOrder + 1 }, (_, i) =>
          routine.stages.filter((s) => s.order === i)
        )

        // 잔디 계산
        const startDate = new Date(routine.createdAt)
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + routine.targetDays - 1)
        const today = new Date()
        const todayStr = today.toISOString().split('T')[0]
        const dDay = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        const dateRange: string[] = []
        const cur = new Date(startDate)
        while (cur <= endDate) {
          dateRange.push(cur.toISOString().split('T')[0])
          cur.setDate(cur.getDate() + 1)
        }

       const todayIdx = dateRange.indexOf(todayStr)
        const currentWeek = weekPage[routine.id] ?? Math.floor(Math.max(0, todayIdx) / 7)
        const totalWeeks = Math.ceil(dateRange.length / 7)
        const visibleDates = dateRange.slice(currentWeek * 7, currentWeek * 7 + 7)

        return (
          <div key={routine.id} className="rounded-[32px] overflow-hidden shadow-sm border"
            style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>

            {/* 잔디 영역 */}
            {routine.stages.length > 0 && (
              <div className="px-4 pt-4 pb-3"
                style={{ backgroundColor: 'var(--color-primary-container)' }}>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWeekPage((prev) => ({ ...prev, [routine.id]: Math.max(0, (prev[routine.id] ?? currentWeek) - 1) }))}
                      disabled={currentWeek === 0}
                      className="bouncy-button w-6 h-6 rounded-lg flex items-center justify-center disabled:opacity-30"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      <span className="material-symbols-outlined text-[14px]">chevron_left</span>
                    </button>
                    <span className="text-[11px] font-bold"
                      style={{ color: 'var(--color-primary)' }}>
                      {currentWeek + 1} / {totalWeeks} 주차
                    </span>
                    <button
                      onClick={() => setWeekPage((prev) => ({ ...prev, [routine.id]: Math.min(totalWeeks - 1, (prev[routine.id] ?? currentWeek) + 1) }))}
                      disabled={currentWeek === totalWeeks - 1}
                      className="bouncy-button w-6 h-6 rounded-lg flex items-center justify-center disabled:opacity-30"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                    {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day!' : '종료'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center">
                    <thead>
                      <tr>
                        <td style={{ minWidth: '40px' }} />
                        {visibleDates.map((date) => {
                          const isToday = date === todayStr
                          const d = new Date(date + 'T00:00:00')
                          return (
                            <td key={date} className="pb-1" style={{ minWidth: '32px' }}>
                              <span className="text-[10px] font-bold block"
                                style={{
                                  color: isToday ? 'var(--color-primary)' : 'var(--color-text-light)',
                                  fontWeight: isToday ? 800 : 400,
                                }}>
                                {d.getMonth() + 1}/{d.getDate()}
                              </span>
                            </td>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {routine.stages.map((stage) => (
                        <tr key={stage.id}>
                          <td className="text-[13px] text-left pr-1 py-0.5"
                            style={{ maxWidth: '40px' }}>
                            {stage.icon}
                          </td>
                          {visibleDates.map((date) => {
                            const isToday = date === todayStr
                            const isFuture = date > todayStr
                            const checked = records.some(
                              (r) => r.stageId === stage.id && r.date === date && r.isCompleted
                            )
                            return (
                              <td key={date} className="py-0.5">
                                <div className="w-6 h-6 rounded-md mx-auto transition-all"
                                  style={{
                                    backgroundColor: checked
                                      ? 'var(--color-primary)'
                                      : isFuture
                                      ? 'rgba(0,0,0,0.06)'
                                      : isToday
                                      ? 'rgba(103,75,181,0.2)'
                                      : 'rgba(0,0,0,0.08)',
                                    border: isToday ? '2px solid var(--color-primary-border)' : 'none',
                                  }}
                                />
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 루틴 헤더 */}
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              <div>
                <h2 className="font-bold text-white text-[15px]">{routine.title}</h2>
                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  목표 {routine.targetDays}일 · ⚡{totalXP}XP
                </span>
              </div>
              <button
                onClick={() => deleteRoutine(routine.id)}
                className="bouncy-button w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* 스테이지 맵 */}
            <div className="p-4 space-y-3">
              {routine.stages.length === 0 && (
                <div className="text-center py-6"
                  style={{ color: 'var(--color-text-light)' }}>
                  <p className="text-[13px] font-bold">습관을 추가해주세요</p>
                </div>
              )}

              {orderGroups.map((group, orderIdx) => (
                <div key={orderIdx}>
                  {orderIdx > 0 && (
                    <div className="flex justify-center my-2">
                      <span className="material-symbols-outlined text-[20px]"
                        style={{ color: 'var(--color-primary-border)' }}>
                        arrow_downward
                      </span>
                    </div>
                  )}
                  <div className={`grid gap-3 ${group.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {group.map((stage) => (
                      <StageCard
                        key={stage.id}
                        stage={stage}
                        routineId={routine.id}
                        isUnlocked={isStageUnlocked(routine.id, stage.id)}
                        onEdit={(s) => onEditStage(routine.id, s)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onAddStage(routine.id, maxOrder + 1)}
                  className="bouncy-button flex-1 py-3 rounded-2xl border-2 border-dashed font-bold text-[13px] flex items-center justify-center gap-1"
                  style={{ borderColor: 'var(--color-primary-border)', color: 'var(--color-primary)' }}
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  다음 습관 추가
                </button>
                {routine.stages.length > 0 && (
                  <button
                    onClick={() => onAddStage(routine.id, maxOrder, 'parallel')}
                    className="bouncy-button flex-1 py-3 rounded-2xl border-2 border-dashed font-bold text-[13px] flex items-center justify-center gap-1"
                    style={{ borderColor: 'var(--color-primary-border)', color: 'var(--color-primary)' }}
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    병렬 추가
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* 루틴 추가 */}
      {isAddingRoutine ? (
        <div className="rounded-[28px] border p-5 space-y-3"
          style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>

          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider mb-1.5 block"
              style={{ color: 'var(--color-text-muted)' }}>
              루틴 이름
            </label>
            <input
              type="text"
              value={newRoutineTitle}
              onChange={(e) => setNewRoutineTitle(e.target.value)}
              placeholder="ex) 건강한 하루"
              autoFocus
              className="w-full rounded-2xl px-4 py-3 text-[15px] font-medium outline-none border-2"
              style={{
                backgroundColor: 'var(--color-surface-container)',
                borderColor: 'var(--color-primary-container)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          <div>
            <label className="text-[12px] font-bold uppercase tracking-wider mb-1.5 block"
              style={{ color: 'var(--color-text-muted)' }}>
              목표 일수 (1일 이상)
            </label>
            <input
              type="number"
              value={newRoutineTargetDays}
              onChange={(e) => setNewRoutineTargetDays(e.target.value)}
              min={1}
              placeholder="ex) 7"
              className="w-full rounded-2xl px-4 py-3 text-[15px] font-medium outline-none border-2"
              style={{
                backgroundColor: 'var(--color-surface-container)',
                borderColor: parseInt(newRoutineTargetDays) < 1 || !newRoutineTargetDays
                  ? 'var(--color-error)'
                  : 'var(--color-primary-container)',
                color: 'var(--color-text)',
              }}
            />
            {(parseInt(newRoutineTargetDays) < 1 || !newRoutineTargetDays) && (
              <p className="text-[11px] mt-1 font-bold" style={{ color: 'var(--color-error)' }}>
                1일 이상 입력해주세요
              </p>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[1, 3, 7, 14, 21, 30].map((d) => (
              <button
                key={d}
                onClick={() => setNewRoutineTargetDays(String(d))}
                className="bouncy-button px-3 py-1.5 rounded-full text-[12px] font-bold border-2 transition-all"
                style={{
                  backgroundColor: newRoutineTargetDays === String(d) ? 'var(--color-primary)' : 'white',
                  color: newRoutineTargetDays === String(d) ? 'white' : 'var(--color-primary)',
                  borderColor: newRoutineTargetDays === String(d) ? 'var(--color-primary)' : 'var(--color-primary-container)',
                }}
              >
                {d}일
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setIsAddingRoutine(false)}
              className="bouncy-button flex-1 py-3 rounded-2xl border-2 font-bold text-[13px]"
              style={{ borderColor: 'var(--color-primary-container)', color: 'var(--color-text-muted)' }}
            >
              취소
            </button>
            <button
              onClick={handleAddRoutine}
              disabled={!newRoutineTitle.trim() || parseInt(newRoutineTargetDays) < 1 || !newRoutineTargetDays}
              className="bouncy-button flex-1 py-3 rounded-2xl font-bold text-white text-[13px] disabled:opacity-40"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              만들기
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingRoutine(true)}
          className="bouncy-button w-full py-4 rounded-[28px] border-2 border-dashed font-bold text-[13px] flex items-center justify-center gap-2"
          style={{ borderColor: 'var(--color-primary-border)', color: 'var(--color-primary)' }}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          새 루틴 추가
        </button>
      )}

    </div>
  )
}
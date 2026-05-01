import { useState } from 'react'
import { useRoutineStore } from '../../store/routineStore'
import StageCard from './StageCard'
import type { Stage } from '../../types'

type Props = {
  onAddStage: (routineId: string, order: number, parallelGroup?: string) => void
  onEditStage: (routineId: string, stage: Stage) => void
}

export default function RoutineMap({ onAddStage, onEditStage }: Props) {
  const { routines, addRoutine, deleteRoutine, isStageUnlocked, getTotalXP } = useRoutineStore()
  const [newRoutineTitle, setNewRoutineTitle] = useState('')
  const [isAddingRoutine, setIsAddingRoutine] = useState(false)

  const handleAddRoutine = () => {
    if (!newRoutineTitle.trim()) return
    addRoutine(newRoutineTitle)
    setNewRoutineTitle('')
    setIsAddingRoutine(false)
  }

  if (routines.length === 0 && !isAddingRoutine) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#a4a4c4]">
        <span className="text-[48px] mb-3">🗺️</span>
        <p className="font-bold text-[15px]">루틴 맵이 없어요</p>
        <p className="text-[13px] mt-1">나만의 루틴을 만들어보세요!</p>
        <button
          onClick={() => setIsAddingRoutine(true)}
          className="bouncy-button mt-4 bg-[#a4a4c4] text-white font-bold px-6 py-3 rounded-2xl text-[13px]"
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

        // order 별로 그룹화
        const maxOrder = Math.max(...routine.stages.map((s) => s.order), -1)
        const orderGroups = Array.from({ length: maxOrder + 1 }, (_, i) =>
          routine.stages.filter((s) => s.order === i)
        )

        return (
          <div key={routine.id} className="bg-white rounded-2xl border border-[#eee] overflow-hidden">

            {/* 루틴 헤더 */}
            <div className="bg-[#a4a4c4] px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-[16px]">{routine.title}</h2>
                <span className="text-white/70 text-[12px]">⚡ 총 {totalXP}XP 획득</span>
              </div>
              <button
                onClick={() => deleteRoutine(routine.id)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <img
                    src="/icons/fi-rs-cross-small.png"
                    alt="delete"
                    className="w-5 h-5 opacity-60 hover:opacity-100"
                />
              </button>
            </div>

            {/* 스테이지 맵 */}
            <div className="p-4 space-y-3">
              {routine.stages.length === 0 && (
                <div className="text-center py-6 text-[#a4a4c4]">
                  <p className="text-[13px] font-bold">습관을 추가해주세요</p>
                </div>
              )}

              {orderGroups.map((group, orderIdx) => (
                <div key={orderIdx}>
                  {/* 연결선 */}
                  {orderIdx > 0 && (
                    <div className="flex justify-center my-2">
                      <div className="flex flex-col items-center">
                        
                        <img
                            src="/icons/fi-rs-angle-down.png"
                            alt="arrow-down"
                            className="w-5 h-5 opacity-60 hover:opacity-100"
                        />
                      </div>
                    </div>
                  )}

                  {/* 병렬 스테이지 */}
                  <div className={`grid gap-3 ${
                    group.length === 1 ? 'grid-cols-1' :
                    group.length === 2 ? 'grid-cols-2' :
                    'grid-cols-2'
                  }`}>
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

              {/* 스테이지 추가 버튼들 */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onAddStage(routine.id, maxOrder + 1)}
                  className="bouncy-button flex-1 py-3 rounded-2xl border-2 border-dashed border-[#dcd7c5] text-[#a4a4c4] font-bold text-[13px] flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">+</span>
                  다음 습관 추가
                </button>
                {routine.stages.length > 0 && (
                  <button
                    onClick={() => onAddStage(routine.id, maxOrder, 'parallel')}
                    className="bouncy-button flex-1 py-3 rounded-2xl border-2 border-dashed border-[#dcd7c5] text-[#a4a4c4] font-bold text-[13px] flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">+</span>
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
        <div className="bg-white rounded-2xl border border-[#eee] p-4">
          <input
            type="text"
            value={newRoutineTitle}
            onChange={(e) => setNewRoutineTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddRoutine()}
            placeholder="루틴 이름 입력 (ex: 건강한 하루)"
            autoFocus
            className="w-full bg-[#f7f4e9] border border-[#eee] rounded-2xl px-4 py-3 text-[15px] font-medium text-[#4a443a] placeholder-[#c4bfb4] outline-none focus:border-[#a4a4c4] mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingRoutine(false)}
              className="bouncy-button flex-1 py-3 rounded-2xl border-2 border-[#eee] font-bold text-[#a4a4c4] text-[13px]"
            >
              취소
            </button>
            <button
              onClick={handleAddRoutine}
              disabled={!newRoutineTitle.trim()}
              className="bouncy-button flex-1 py-3 rounded-2xl bg-[#a4a4c4] font-bold text-white text-[13px] disabled:opacity-40"
            >
              만들기
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingRoutine(true)}
          className="bouncy-button w-full py-4 rounded-2xl border-2 border-dashed border-[#dcd7c5] text-[#a4a4c4] font-bold text-[13px] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">+</span>
          새 루틴 추가
        </button>
      )}

    </div>
  )
}
import { useRoutineStore } from '../../store/routineStore'
import type { Stage } from '../../types'

type Props = {
  stage: Stage
  routineId: string
  isUnlocked: boolean
  onEdit: (stage: Stage) => void
}

export default function StageCard({ stage, routineId, isUnlocked, onEdit }: Props) {
  const { toggleStageRecord, isStageCompleted, getStageStreak, deleteStage } = useRoutineStore()
  const today = new Date().toISOString().split('T')[0]
  const completed = isStageCompleted(stage.id, today)
  const streak = getStageStreak(stage.id)

  return (
    <div className="rounded-[24px] border p-4 transition-all"
      style={{
        backgroundColor: !isUnlocked ? 'var(--color-surface-container)' :
                         completed ? 'var(--color-primary-container)' :
                         'white',
        borderColor: !isUnlocked ? 'var(--color-surface-dim)' :
                     completed ? 'var(--color-primary-border)' :
                     'var(--color-primary-container)',
        opacity: !isUnlocked ? 0.5 : 1,
      }}>

      <div className="flex items-center gap-3">

        {/* 아이콘 */}
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-[22px] flex-shrink-0"
          style={{
            backgroundColor: !isUnlocked ? 'var(--color-surface-dim)' :
                             completed ? 'var(--color-primary-container)' :
                             'var(--color-surface-container)',
          }}>
          {!isUnlocked ? '🔒' : stage.icon}
        </div>

        {/* 내용 */}
        <div className="flex-grow min-w-0">
          <span className="font-bold text-[14px] block truncate"
            style={{ color: !isUnlocked ? 'var(--color-text-light)' : 'var(--color-text)' }}>
            {stage.title}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            
            {!isUnlocked && (
              <span className="text-[11px] font-bold" style={{ color: 'var(--color-text-light)' }}>
                이전 습관 완료 후 해금
              </span>
            )}
          </div>
        </div>

        {/* 오른쪽 버튼 */}
        <div className="flex items-center gap-3.5 flex-shrink-0">
          {isUnlocked && (
            <button
               onClick={() => toggleStageRecord(stage.id, today)}
              className="bouncy-button w-8 h-8 font-bold rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }}
            >
              <span className="material-symbols-outlined text-[12px]"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                pets
              </span>
            </button>


    
            
          )}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onEdit(stage)}
              className="w-5 h-5 flex items-center justify-center"
              style={{ color: 'var(--color-text-light)' }}
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
            </button>
            <button
              onClick={() => deleteStage(routineId, stage.id)}
              className="w-5 h-5 flex items-center justify-center"
              style={{ color: 'var(--color-text-light)' }}
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
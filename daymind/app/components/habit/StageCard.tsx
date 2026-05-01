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
  const progressPercent = Math.min((streak / stage.targetDays) * 100, 100)
  const isClear = streak >= stage.targetDays

  return (
    <div className={`rounded-2xl border p-4 transition-all ${
      !isUnlocked
        ? 'bg-[#f5f5f5] border-[#eee] opacity-60'
        : isClear
        ? 'bg-[#eee8d5] border-[#dcd7c5]'
        : completed
        ? 'bg-[#f5f3ff] border-[#a4a4c4]'
        : 'bg-white border-[#eee]'
    }`}>

      <div className="flex items-start justify-between gap-3">

        {/* 왼쪽 */}
        <div className="flex items-center gap-3 flex-grow">

          {/* 아이콘 */}
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] flex-shrink-0 ${
            !isUnlocked ? 'bg-[#eee]' :
            isClear ? 'bg-[#dcd7c5]' :
            completed ? 'bg-[#a4a4c4]/20' :
            'bg-[#f7f4e9]'
          }`}>
            {!isUnlocked ? '🔒' : stage.icon}
          </div>

          {/* 내용 */}
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              {isClear && (
                <span className="text-[10px] font-bold bg-[#8c7a2e] text-white px-2 py-0.5 rounded-full">
                  클리어 ✨
                </span>
              )}
              <span className={`font-bold text-[14px] ${
                !isUnlocked ? 'text-[#a4a4c4]' : 'text-[#4a443a]'
              }`}>
                {stage.title}
              </span>
            </div>

            {/* 진행바 */}
            <div className="flex items-center gap-2">
              <div className="flex-grow h-1.5 bg-[#eee] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isClear
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                      : 'bg-gradient-to-r from-[#a4a4c4] to-[#8888aa]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-[#a4a4c4] flex-shrink-0">
                {streak}/{stage.targetDays}일
              </span>
            </div>

            {/* 스트릭 + XP */}
            <div className="flex items-center gap-3 mt-1">
              {isUnlocked && (
                <>
                  {streak > 0 ? (
                    <span className="text-[11px] font-bold text-orange-400">
                      🔥 {streak}일 연속
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-[#c4bfb4]">
                      💀 0일 연속
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-[#a4a4c4]">
                    ⚡ {stage.rewardXP}XP
                  </span>
                </>
              )}
              {!isUnlocked && (
                <span className="text-[11px] font-bold text-[#c4bfb4]">
                  이전 스테이지 클리어 후 해금
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽 버튼 */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          {isUnlocked && !isClear && (
            <button
              onClick={() => toggleStageRecord(stage.id, today)}
              className={`bouncy-button w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                completed
                  ? 'bg-[#a4a4c4] text-white'
                  : 'bg-[#f7f4e9] border-2 border-[#dcd7c5] text-[#a4a4c4]'
              }`}
            >
               <img
              src="/icons/fi-rs-check.png"
              alt="check"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
            </button>
          )}
          {isClear && (
            <div className="w-10 h-10 rounded-2xl bg-[#dcd7c5] flex items-center justify-center text-[20px]">
              ⭐
            </div>
          )}
          <button
            onClick={() => onEdit(stage)}
            className="text-[#c4bfb4] hover:text-[#a4a4c4] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
          <button
            onClick={() => deleteStage(routineId, stage.id)}
            className="text-[#c4bfb4] hover:text-red-400 transition-colors"
          >
            <img
              src="/icons/fi-rs-cross-small.png"
              alt="delete"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
          </button>
        </div>

      </div>
    </div>
  )
}
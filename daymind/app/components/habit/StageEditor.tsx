import { useState, useEffect } from 'react'
import { useRoutineStore } from '../../store/routineStore'
import type { Stage } from '../../types'

type Props = {
  isOpen: boolean
  onClose: () => void
  routineId: string
  order: number
  editStage?: Stage | null
}

const ICONS = [
  '💧', '🏃', '📚', '🧘', '💪', '🥗',
  '😴', '✍️', '🎯', '🧹', '💊', '🎵',
  '🌿', '🚴', '🧠', '💻', '🌅', '🙏',
  '🍎', '☕', '🎨', '🧗', '🏊', '🌙',
]

const TARGET_DAYS_OPTIONS = [3, 7, 14, 21, 30, 60, 90]

export default function StageEditor({ isOpen, onClose, routineId, order, editStage }: Props) {
  const { addStage, updateStage } = useRoutineStore()

  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('🎯')
  const [targetDays, setTargetDays] = useState(7)
  const [rewardXP, setRewardXP] = useState(50)
  const [customDays, setCustomDays] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  useEffect(() => {
    if (editStage) {
      setTitle(editStage.title)
      setIcon(editStage.icon)
      setTargetDays(editStage.targetDays)
      setRewardXP(editStage.rewardXP)
      const isPreset = TARGET_DAYS_OPTIONS.includes(editStage.targetDays)
      setIsCustom(!isPreset)
      if (!isPreset) setCustomDays(String(editStage.targetDays))
    } else {
      setTitle('')
      setIcon('🎯')
      setTargetDays(7)
      setRewardXP(50)
      setIsCustom(false)
      setCustomDays('')
    }
  }, [editStage, isOpen])

  const handleSubmit = () => {
    if (!title.trim()) return
    const finalDays = isCustom ? parseInt(customDays) || 7 : targetDays

    if (editStage) {
      updateStage(routineId, editStage.id, {
        title,
        icon,
        targetDays: finalDays,
        rewardXP,
      })
    } else {
      addStage(routineId, {
        title,
        icon,
        targetDays: finalDays,
        rewardXP,
        order,
      })
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-[32px] z-50 p-6 pb-10 shadow-xl max-h-[90vh] overflow-y-auto">

        <div className="w-10 h-1 bg-[#eee] rounded-full mx-auto mb-6" />

        <h2 className="font-bold text-[18px] text-[#4a443a] mb-6">
          {editStage ? '스테이지 수정' : '스테이지 추가'}
        </h2>

        {/* 아이콘 선택 */}
        <div className="mb-5">
          <label className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider mb-2 block">
            아이콘
          </label>
          <div className="grid grid-cols-6 gap-2">
            {ICONS.map((i) => (
              <button
                key={i}
                onClick={() => setIcon(i)}
                className={`bouncy-button aspect-square rounded-2xl text-[24px] flex items-center justify-center transition-all ${
                  icon === i
                    ? 'bg-[#a4a4c4]/20 border-2 border-[#a4a4c4]'
                    : 'bg-[#f7f4e9] border-2 border-transparent'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* 미션 이름 */}
        <div className="mb-5">
          <label className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider mb-2 block">
            미션 이름
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="ex) 물 한잔 마시기"
            autoFocus
            className="w-full bg-[#f7f4e9] border border-[#eee] rounded-2xl px-4 py-3 text-[15px] font-medium text-[#4a443a] placeholder-[#c4bfb4] outline-none focus:border-[#a4a4c4] transition-colors"
          />
        </div>

        {/* 목표 일수 */}
        <div className="mb-5">
          <label className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider mb-2 block">
            목표 일수
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {TARGET_DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => { setTargetDays(d); setIsCustom(false) }}
                className={`bouncy-button px-4 py-2 rounded-full text-[13px] font-bold border-2 transition-all ${
                  !isCustom && targetDays === d
                    ? 'bg-[#a4a4c4] text-white border-[#a4a4c4]'
                    : 'bg-white text-[#a4a4c4] border-[#eee]'
                }`}
              >
                {d}일
              </button>
            ))}
            <button
              onClick={() => setIsCustom(true)}
              className={`bouncy-button px-4 py-2 rounded-full text-[13px] font-bold border-2 transition-all ${
                isCustom
                  ? 'bg-[#a4a4c4] text-white border-[#a4a4c4]'
                  : 'bg-white text-[#a4a4c4] border-[#eee]'
              }`}
            >
              직접입력
            </button>
          </div>
          {isCustom && (
            <input
              type="number"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              placeholder="목표 일수 입력"
              className="w-full bg-[#f7f4e9] border border-[#eee] rounded-2xl px-4 py-3 text-[15px] font-medium text-[#4a443a] outline-none focus:border-[#a4a4c4] transition-colors"
            />
          )}
        </div>

        {/* 보상 XP */}
        <div className="mb-8">
          <label className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider mb-2 block">
            보상 XP
          </label>
          <div className="flex gap-2">
            {[10, 25, 50, 100, 200].map((xp) => (
              <button
                key={xp}
                onClick={() => setRewardXP(xp)}
                className={`bouncy-button flex-1 py-2.5 rounded-2xl text-[13px] font-bold border-2 transition-all ${
                  rewardXP === xp
                    ? 'bg-[#a4a4c4] text-white border-[#a4a4c4]'
                    : 'bg-white text-[#a4a4c4] border-[#eee]'
                }`}
              >
                ⚡{xp}
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="bouncy-button flex-1 py-3.5 rounded-2xl border-2 border-[#eee] font-bold text-[#a4a4c4]"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="bouncy-button flex-1 py-3.5 rounded-2xl bg-[#a4a4c4] font-bold text-white disabled:opacity-40"
          >
            {editStage ? '수정' : '추가'}
          </button>
        </div>

      </div>
    </>
  )
}
import { useState } from 'react'
import { useHabitStore } from '../../store/habitStore'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ICONS = [
  '💧', '🏃', '📚', '🧘', '💪', '🥗',
  '😴', '✍️', '🎯', '🧹', '💊', '🎵',
  '🌿', '🚴', '🧠', '💻', '🌅', '🙏',
]

export default function HabitModal({ isOpen, onClose }: Props) {
  const { addHabit } = useHabitStore()
  const [title, setTitle] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('🔥')

  const handleSubmit = () => {
    if (!title.trim()) return
    addHabit(title, selectedIcon)
    setTitle('')
    setSelectedIcon('🔥')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-[32px] z-50 p-6 pb-10 shadow-xl">
        
        {/* 핸들 */}
        <div className="w-10 h-1 bg-[#eee] rounded-full mx-auto mb-6" />

        {/* 타이틀 */}
        <h2 className="font-bold text-[18px] text-[#4a443a] mb-6">
          습관 퀘스트 추가
        </h2>

        {/* 아이콘 선택 */}
        <div className="mb-5">
          <label className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider mb-2 block">
            아이콘 선택
          </label>
          <div className="grid grid-cols-6 gap-2">
            {ICONS.map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className={`bouncy-button w-full aspect-square rounded-2xl text-[24px] flex items-center justify-center transition-all ${
                  selectedIcon === icon
                    ? 'bg-[#a4a4c4]/20 border-2 border-[#a4a4c4]'
                    : 'bg-[#f7f4e9] border-2 border-transparent'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* 이름 입력 */}
        <div className="mb-8">
          <label className="text-[12px] font-bold text-[#a4a4c4] uppercase tracking-wider mb-2 block">
            습관 이름
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="ex) 물 8잔 마시기"
            autoFocus
            className="w-full bg-[#f7f4e9] border border-[#eee] rounded-2xl px-4 py-3 text-[15px] font-medium text-[#4a443a] placeholder-[#c4bfb4] outline-none focus:border-[#a4a4c4] transition-colors"
          />
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
            추가
          </button>
        </div>

      </div>
    </>
  )
}
import { useState, useEffect } from 'react'
import { useRoutineStore } from '../../store/routineStore'
import type { Stage } from '../../types'
import DraggableButton from '../ui/DraggableButton'

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

export default function StageEditor({ isOpen, onClose, routineId, order, editStage }: Props) {
  const { addStage, updateStage } = useRoutineStore()

  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState('🎯')


  useEffect(() => {
    if (editStage) {
      setTitle(editStage.title)
      setIcon(editStage.icon)

    } else {
      setTitle('')
      setIcon('🎯')
      //setRewardXP(50)
    }
  }, [editStage, isOpen])

  const handleSubmit = () => {
    if (!title.trim()) return
    if (editStage) {
      updateStage(routineId, editStage.id, { title, icon })
    } else {
      addStage(routineId, { title, icon, order })
    }
    onClose()
  }

  if (!isOpen) return null

 return (
  <>

      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-lg bg-white rounded-[32px] p-6 pb-10 shadow-xl max-h-[90vh] overflow-y-auto">

          <div className="w-10 h-1 rounded-full mx-auto mb-6"
            style={{ backgroundColor: 'var(--color-primary-container)' }} />

          <h2 className="font-bold text-[18px] mb-6" style={{ color: 'var(--color-primary)' }}>
            {editStage ? '습관 수정' : '습관 추가'}
          </h2>

          {/* 아이콘 선택 */}
          <div className="mb-5">
            <label className="text-[12px] font-bold uppercase tracking-wider mb-2 block"
              style={{ color: 'var(--color-text-muted)' }}>
              아이콘
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className="bouncy-button aspect-square rounded-2xl text-[24px] flex items-center justify-center transition-all border-2"
                  style={{
                    backgroundColor: icon === i ? 'var(--color-primary-container)' : 'var(--color-surface-container)',
                    borderColor: icon === i ? 'var(--color-primary)' : 'transparent',
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* 미션 이름 */}
          <div className="mb-8">
            <label className="text-[12px] font-bold uppercase tracking-wider mb-2 block"
              style={{ color: 'var(--color-text-muted)' }}>
              미션 이름
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="ex) 물 한잔 마시기"
              autoFocus
              className="w-full rounded-2xl px-4 py-3 text-[15px] font-medium outline-none border-2"
              style={{
                backgroundColor: 'var(--color-surface-container)',
                borderColor: 'var(--color-primary-container)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="bouncy-button flex-1 py-3.5 rounded-2xl border-2 font-bold text-[13px]"
              style={{ borderColor: 'var(--color-primary-container)', color: 'var(--color-text-muted)' }}
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="bouncy-button flex-1 py-3.5 rounded-2xl font-bold text-white text-[13px] disabled:opacity-40"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {editStage ? '수정' : '추가'}
            </button>
          </div>

        </div>
      </div>
    </>
  )

}
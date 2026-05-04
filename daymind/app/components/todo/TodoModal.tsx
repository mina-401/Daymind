import { useState, useEffect } from 'react'
import type { Todo, EnergyLevel } from '../../types'
import { useTodoStore } from '../../store/todoStore'

type Props = {
  isOpen: boolean
  onClose: () => void
  editTodo?: Todo | null
  date: string
}

const energyOptions: { value: EnergyLevel; label: string; color: string }[] = [
  { value: 'low', label: '🟢 저에너지', color: 'bg-green-100 border-green-300 text-green-700' },
  { value: 'medium', label: '🟡 중에너지', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { value: 'high', label: '🔴 고에너지', color: 'bg-red-100 border-red-300 text-red-700' },
]

export default function TodoModal({ isOpen, onClose, editTodo, date }: Props) {
  const { addTodo, updateTodo } = useTodoStore()

  const [title, setTitle] = useState('')
  const [energy, setEnergy] = useState<EnergyLevel>('medium')
  const [startTime, setStartTime] = useState('')  
  const [endTime, setEndTime] = useState('')     

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title)
      setEnergy(editTodo.energy)
      setStartTime(editTodo.startTime ?? '')
      setEndTime(editTodo.endTime ?? '')
    } else {
      setTitle('')
      setEnergy('medium')
      setStartTime('')
      setEndTime('')
    }
  }, [editTodo, isOpen])

  const handleSubmit = () => {
    if (!title.trim()) return
    if (editTodo) {
      updateTodo(editTodo.id, { title, energy, startTime: startTime || undefined, endTime: endTime || undefined })
    } else {
      addTodo(title, date, energy, startTime || undefined, endTime || undefined)
    }
    onClose()
  }

  if (!isOpen) return null

 return (
  <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-lg bg-white rounded-[32px] p-6 pb-8 shadow-xl">

          <div className="w-10 h-1 rounded-full mx-auto mb-6"
            style={{ backgroundColor: 'var(--color-primary-container)' }} />

          <h2 className="font-bold text-[18px] mb-6" style={{ color: 'var(--color-primary)' }}>
            {editTodo ? '할 일 수정' : '할 일 추가'}
          </h2>

          {/* 할일 입력 */}
          <div className="mb-5">
            <label className="text-[12px] font-bold uppercase tracking-wider mb-2 block"
              style={{ color: 'var(--color-text-muted)' }}>
              할 일
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="무엇을 할까요?"
              autoFocus
              className="w-full rounded-2xl px-4 py-3 text-[15px] font-medium outline-none border-2"
              style={{
                backgroundColor: 'var(--color-surface-container)',
                borderColor: 'var(--color-primary-container)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          {/* 에너지 선택 */}
          <div className="mb-5">
            <label className="text-[12px] font-bold uppercase tracking-wider mb-2 block"
              style={{ color: 'var(--color-text-muted)' }}>
              에너지 소모량
            </label>
            <div className="flex gap-2">
              {energyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEnergy(option.value)}
                  className={`bouncy-button flex-1 py-2.5 rounded-2xl border-2 text-[13px] font-bold transition-all ${
                    energy === option.value
                      ? option.color
                      : 'bg-white border-[#eee] text-[#a4a4c4]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 시간 설정 */}
          <div className="mb-8">
            <label className="text-[12px] font-bold uppercase tracking-wider mb-2 block"
              style={{ color: 'var(--color-text-muted)' }}>
              시간 설정 (선택)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="flex-1 rounded-2xl px-4 py-3 text-[15px] font-medium outline-none border-2"
                style={{
                  backgroundColor: 'var(--color-surface-container)',
                  borderColor: 'var(--color-primary-container)',
                  color: 'var(--color-text)',
                }}
              />
              <span className="font-bold" style={{ color: 'var(--color-text-muted)' }}>~</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="flex-1 rounded-2xl px-4 py-3 text-[15px] font-medium outline-none border-2"
                style={{
                  backgroundColor: 'var(--color-surface-container)',
                  borderColor: 'var(--color-primary-container)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
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
              {editTodo ? '수정' : '추가'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
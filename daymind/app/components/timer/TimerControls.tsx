import { useEffect } from 'react'
import { useTimerStore } from '../../store/timerStore'

export default function TimerControls() {
  const { status, start, pause, resume, reset, tick, selectedTodoId } = useTimerStore()

  useEffect(() => {
    if (status !== 'running') return
    const interval = setInterval(() => tick(), 1000)
    return () => clearInterval(interval)
  }, [status])

  return (
    <div className="flex flex-col items-center gap-4">

      <div className="flex items-center gap-6">
        {/* 리셋 */}
        <button
          onClick={reset}
          className="bouncy-button w-12 h-12 rounded-2xl flex items-center justify-center border-2"
          style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)', color: 'var(--color-primary)' }}
        >
          <span className="material-symbols-outlined text-[22px]">restart_alt</span>
        </button>

        {/* 시작/정지 버튼 */}
        {status === 'idle' && (
          <button
            onClick={() => start(selectedTodoId)}
            className="bouncy-button w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <span className="material-symbols-outlined text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </button>
        )}
        {status === 'running' && (
          <button
            onClick={pause}
            className="bouncy-button w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <span className="material-symbols-outlined text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              pause
            </span>
          </button>
        )}
        {status === 'paused' && (
          <button
            onClick={resume}
            className="bouncy-button w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <span className="material-symbols-outlined text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </button>
        )}
        {status === 'finished' && (
          <button
            onClick={reset}
            className="bouncy-button w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-primary)' }}
          >
            <span className="material-symbols-outlined text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              check
            </span>
          </button>
        )}

        <div className="w-12 h-12" />
      </div>

      {/* 완료 메시지 */}
      {status === 'finished' && (
        <div className="rounded-2xl px-6 py-3 text-center border-2"
          style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-primary-border)' }}>
          <p className="font-bold text-[14px]" style={{ color: 'var(--color-primary)' }}>
            🎉 집중 완료!
          </p>
        </div>
      )}

    </div>
  )
}
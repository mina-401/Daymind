import { useEffect } from 'react'
import { useTimerStore } from '../../store/timerStore'


export default function TimerControls() {
  const { status, start, pause, resume, reset, tick, finish, selectedTodoId } = useTimerStore()


  // 1초마다 tick
  useEffect(() => {
    if (status !== 'running') return
    const interval = setInterval(() => tick(), 1000)
    return () => clearInterval(interval)
  }, [status])



  return (
    <div className="flex flex-col items-center gap-4">

      {/* 메인 버튼 */}
      <div className="flex items-center gap-4">
        {/* 리셋 */}
        <button
          onClick={reset}
          className="bouncy-button w-12 h-12 rounded-2xl bg-white border border-[#eee] flex items-center justify-center text-[#a4a4c4]"
        >
          <span className="material-symbols-outlined text-[22px]">restart_alt</span>
        </button>

        {/* 시작/정지 */}
        {status === 'idle' && (
          <button
            onClick={() => start(selectedTodoId)}
            className="bouncy-button w-20 h-20 rounded-3xl bg-[#a4a4c4] flex items-center justify-center shadow-lg"
          >
            <span className="material-symbols-outlined text-white text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </button>
        )}
        {status === 'running' && (
          <button
            onClick={pause}
            className="bouncy-button w-20 h-20 rounded-3xl bg-[#a4a4c4] flex items-center justify-center shadow-lg"
          >
            <span className="material-symbols-outlined text-white text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              pause
            </span>
          </button>
        )}
        {status === 'paused' && (
          <button
            onClick={resume}
            className="bouncy-button w-20 h-20 rounded-3xl bg-[#a4a4c4] flex items-center justify-center shadow-lg"
          >
            <span className="material-symbols-outlined text-white text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </button>
        )}
        {status === 'finished' && (
          <button
            onClick={reset}
            className="bouncy-button w-20 h-20 rounded-3xl bg-[#eee8d5] border border-[#dcd7c5] flex items-center justify-center shadow-lg"
          >
            <span className="material-symbols-outlined text-[#8c7a2e] text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              check
            </span>
          </button>
        )}

        {/* 빈 공간 균형용 */}
        <div className="w-12 h-12" />
      </div>

      {/* 완료 메시지 */}
      {status === 'finished' && (
        <div className="bg-[#eee8d5] border border-[#dcd7c5] rounded-2xl px-6 py-3 text-center">
          <p className="font-bold text-[14px] text-[#8c7a2e]">🎉 집중 완료!</p>
          {selectedTodoId && (
            <p className="text-[12px] text-[#8c7a2e] mt-0.5">할 일을 완료 처리했어요</p>
          )}
        </div>
      )}

    </div>
  )
}
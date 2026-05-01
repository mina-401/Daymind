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
          <img
            src="/icons/fi-rs-rotate-right.png"
            alt="reset"
            className="w-5 h-5 opacity-60 hover:opacity-100"
          />
        </button>

        {/* 시작/정지 */}
        {status === 'idle' && (
          <button
            onClick={() => start(selectedTodoId)}
            className="bouncy-button w-15 h-15 rounded-3xl bg-[#a4a4c4] flex items-center justify-center shadow-lg"
          >
            <img
              src="/icons/fi-rs-play.png"
              alt="play"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
          </button>
        )}
        {status === 'running' && (
          <button
            onClick={pause}
            className="bouncy-button w-15 h-15 rounded-3xl bg-[#a4a4c4] flex items-center justify-center shadow-lg"
          >
            <img
              src="/icons/fi-rs-pause.png"
              alt="pause"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
          </button>
        )}
        {status === 'paused' && (
          <button
            onClick={resume}
            className="bouncy-button w-15 h-15 rounded-3xl bg-[#a4a4c4] flex items-center justify-center shadow-lg"
          >
            <img
              src="/icons/fi-rs-play.png"
              alt="play"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
          </button>
        )}
        {status === 'finished' && (
          <button
            onClick={reset}
            className="bouncy-button w-15 h-15 rounded-3xl bg-[#eee8d5] border border-[#dcd7c5] flex items-center justify-center shadow-lg"
          >
             <img
              src="/icons/fi-rs-check.png"
              alt="check"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
          </button>
        )}

        {/* 빈 공간 균형용 */}
        <div className="w-12 h-12" />
      </div>

      {/* 완료 메시지 */}
      {status === 'finished' && (
        <div className="bg-[#eee8d5] border border-[#dcd7c5] rounded-2xl px-6 py-3 text-center">
          <p className="font-bold text-[14px] text-[#8c7a2e]">집중 완료!</p>
          
        </div>
      )}

    </div>
  )
}
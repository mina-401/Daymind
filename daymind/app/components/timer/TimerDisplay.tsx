import { useTimerStore } from '../../store/timerStore'

function formatTime(seconds: number) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function TimerDisplay() {
  const { secondsLeft, duration, status } = useTimerStore()
  const percent = ((duration - secondsLeft) / duration) * 100

  return (
    <div className="flex flex-col items-center justify-center py-8">
      
      {/* 원형 진행률 */}
      <div className="relative w-52 h-52 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* 배경 원 */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#eee"
            strokeWidth="6"
          />
          {/* 진행 원 */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#a4a4c4"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percent / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>

        {/* 타이머 숫자 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[48px] font-bold text-[#4a443a] leading-none tracking-tight">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-[12px] font-bold text-[#a4a4c4] mt-1 uppercase tracking-wider">
            {status === 'idle' ? '준비' :
             status === 'running' ? '집중 중' :
             status === 'paused' ? '일시정지' :
             '완료!'}
          </span>
        </div>
      </div>

      {/* 시간 설정 버튼 */}
      <div className="flex gap-2">
        {[15, 25, 45].map((min) => (
          <button
            key={min}
            onClick={() => useTimerStore.getState().setDuration(min)}
            className={`bouncy-button px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
              duration === min * 60
                ? 'bg-[#a4a4c4] text-white border-[#a4a4c4]'
                : 'bg-white text-[#a4a4c4] border-[#eee]'
            }`}
          >
            {min}분
          </button>
        ))}
      </div>
    </div>
  )
}
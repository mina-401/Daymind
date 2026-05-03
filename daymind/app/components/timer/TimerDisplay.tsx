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
          <circle cx="50" cy="50" r="45" fill="none" stroke="#ede9ff" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percent / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[48px] font-bold leading-none tracking-tight"
            style={{ color: 'var(--color-text)' }}>
            {formatTime(secondsLeft)}
          </span>
          <span className="text-[12px] font-bold mt-1 uppercase tracking-wider"
            style={{ color: 'var(--color-primary)' }}>
            {status === 'idle' ? '준비' :
             status === 'running' ? '집중 중' :
             status === 'paused' ? '일시정지' :
             '완료!'}
          </span>
        </div>
      </div>

      {/* 시간 설정 */}
      <div className="flex flex-col items-center gap-3 w-full px-4">

        {/* +/- 버튼 */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => useTimerStore.getState().setDuration(Math.max(5, Math.floor(duration / 60) - 5))}
            className="bouncy-button w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-[18px] border-2"
            style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-primary-border)', color: 'var(--color-primary)' }}
          >
            −
          </button>
          <span className="text-[16px] font-bold w-20 text-center"
            style={{ color: 'var(--color-primary)' }}>
            {Math.floor(duration / 60)}분
          </span>
          <button
            onClick={() => useTimerStore.getState().setDuration(Math.min(180, Math.floor(duration / 60) + 10))}
            className="bouncy-button w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-[18px] border-2"
            style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-primary-border)', color: 'var(--color-primary)' }}
          >
            +
          </button>
        </div>

        {/* 빠른 선택 */}
        <div className="flex gap-2 flex-wrap justify-center">
          {[1,5, 25, 45, 60, 90, 120].map((min) => (
            <button
              key={min}
              onClick={() => useTimerStore.getState().setDuration(min)}
              className="bouncy-button px-3 py-1.5 rounded-full text-[12px] font-bold border-2 transition-all"
              style={{
                backgroundColor: duration === min * 60 ? 'var(--color-primary)' : 'white',
                color: duration === min * 60 ? 'white' : 'var(--color-primary)',
                borderColor: duration === min * 60 ? 'var(--color-primary)' : 'var(--color-primary-container)',
              }}
            >
              {min >= 60 ? `${min / 60}시간` : `${min}분`}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
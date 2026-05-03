import { useHabitStore } from '../../store/habitStore'
import type { Habit } from '../../types'

type Props = {
  habit: Habit
  date: string
}

export default function HabitItem({ habit, date }: Props) {
  const { toggleHabitRecord, isCompleted, getStreak, deleteHabit } = useHabitStore()
  const completed = isCompleted(habit.id, date)
  const streak = getStreak(habit.id)

  return (
    <div className={` bg-white rounded-2xl p-4 border transition-all ${
  completed ? 'border-[#a4a4c4] bg-[#f5f3ff]' : 'border-[#eee]'
}`}>
  <div className="flex gap-3 items-center">

    {/* 좌측: 아이콘 + streak */}
    <div className="flex flex-col items-center flex-shrink-0">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-[20px] sm:text-[24px] ${
        completed ? 'bg-[#a4a4c4]/20' : 'bg-[#f7f4e9]'
      }`}>
        {habit.icon}
      </div>

      <div className="flex items-center gap-1 mt-1">
        <span className="text-[12px]">🔥</span>
        <span className="text-[11px] font-bold text-orange-400">
          {streak}
        </span>
      </div>
    </div>

    {/* 가운데: 텍스트 */}
    <div className="flex-grow min-w-0">
      <p className={`font-bold text-[14px] sm:text-[15px] truncate ${
        completed ? 'text-[#a4a4c4] line-through' : 'text-[#4a443a]'
      }`}>
        {habit.title}
      </p>
    </div>

    {/* 우측: 버튼 */}
    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

      {/* 삭제 */}
      <button
        onClick={() => deleteHabit(habit.id)}
        className="p-1.5 rounded-xl hover:bg-red-50 transition"
      >
        <img
          src="/icons/fi-rs-cross-small.png"
          className="w-4 h-4 sm:w-5 sm:h-5 opacity-60"
        />
      </button>

      {/* 체크 */}
      <button
        onClick={() => toggleHabitRecord(habit.id, date)}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition ${
          completed
            ? 'bg-[#a4a4c4]'
            : 'bg-[#f7f4e9] border border-[#dcd7c5]'
        }`}
      >
        <img
          src="/icons/fi-rs-check.png"
          className={`w-4 h-4 sm:w-5 sm:h-5 ${
            completed ? 'invert brightness-0' : 'opacity-60'
          }`}
        />
      </button>

    </div>

  </div>
</div>
  )
}
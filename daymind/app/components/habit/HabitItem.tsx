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
    <div className={`bg-white rounded-2xl p-4 border transition-all ${
      completed ? 'border-[#a4a4c4] bg-[#f5f3ff]' : 'border-[#eee]'
    }`}>
      <div className="flex items-center gap-3">

        {/* 이모지 아이콘 */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] flex-shrink-0 ${
          completed ? 'bg-[#a4a4c4]/20' : 'bg-[#f7f4e9]'
        }`}>
          {habit.icon}
        </div>

        {/* 내용 */}
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-[15px] ${
              completed ? 'text-[#a4a4c4] line-through' : 'text-[#4a443a]'
            }`}>
              {habit.title}
            </span>
          </div>

          {/* 스트릭 */}
          <div className="flex items-center gap-1 mt-0.5">
            {streak > 0 ? (
              <>
                <span className="text-[14px]">🔥</span>
                <span className="text-[12px] font-bold text-orange-400">
                  {streak}일 연속
                </span>
              </>
            ) : (
              <>
                <span className="text-[14px]">💀</span>
                <span className="text-[12px] font-bold text-[#c4bfb4]">
                  0일 연속
                </span>
              </>
            )}
          </div>
        </div>

        {/* 체크 버튼 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => deleteHabit(habit.id)}
            className="p-1.5 rounded-xl text-[#a4a4c4] hover:bg-red-50 hover:text-red-400 transition-colors"
          >
            <img
              src="/icons/fi-rs-cross-small.png"
              alt="delete"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
          </button>
          <button
            onClick={() => toggleHabitRecord(habit.id, date)}
            className={`bouncy-button w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              completed
                ? 'bg-[#a4a4c4] text-white'
                : 'bg-[#f7f4e9] border-2 border-[#dcd7c5] text-[#a4a4c4]'
            }`}
          >
             <img
              src="/icons/fi-rs-check.png"
              alt="check"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
          </button>
        </div>

      </div>
    </div>
  )
}
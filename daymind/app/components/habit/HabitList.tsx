import { useHabitStore } from '../../store/habitStore'
import HabitItem from './HabitItem'

type Props = {
  date: string
  onAdd: () => void
}

export default function HabitList({ date, onAdd }: Props) {
  const { habits } = useHabitStore()

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-[#a4a4c4]">
        <span className="text-[48px] mb-3">🔥</span>
        <p className="font-bold text-[15px]">습관 퀘스트가 없어요</p>
        <p className="text-[13px] mt-1">아래 버튼으로 추가해보세요!</p>
        <button
          onClick={onAdd}
          className="bouncy-button mt-4 bg-[#a4a4c4] text-white font-bold px-6 py-3 rounded-2xl text-[13px]"
        >
          + 습관 추가
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} date={date} />
      ))}
    </div>
  )
}
type Props = {
  date: string
}

export default function DayView({ date }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[#a4a4c4]">
      <span className="material-symbols-outlined text-[48px] mb-3">calendar_today</span>
      <p className="font-bold text-[15px]">일간 뷰</p>
      <p className="text-[13px] mt-1">{date}</p>
    </div>
  )
}
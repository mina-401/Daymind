import MonthlyView from '../components/calendar/MonthlyView'

export default function Calendar() {
  return (
    <>
      {/* 헤더 */}
      <header className="bg-[#a4a4c4] pt-4 pb-6 px-4 rounded-b-[24px]">
        <div className="flex justify-between items-center">
          <h1 className="text-white font-bold text-xl px-2">캘린더</h1>
        </div>
      </header>

      {/* 메인 */}
      <main className="px-4 mt-5 max-w-2xl mx-auto">
        <MonthlyView />
      </main>
    </>
  )
}
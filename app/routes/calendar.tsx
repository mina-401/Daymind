import MonthlyView from '../components/calendar/MonthlyView'

export default function Calendar() {
  return (
    <>
      {/* 헤더 */}
      <header className="app-header px-5 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-primary-border)' }}>
              <span className="material-symbols-outlined text-[20px]"
                style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                calendar_month
              </span>
            </div>
            <h1 className="font-bold text-xl" style={{ color: 'var(--color-primary)' }}>캘린더</h1>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="px-4 mt-5 max-w-2xl mx-auto">
        <MonthlyView />
      </main>
    </>
  )
}
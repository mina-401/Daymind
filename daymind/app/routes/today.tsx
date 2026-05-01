import { useEffect, useState } from 'react'
import HabitList from '../components/habit/HabitList'
import HabitModal from '../components/habit/HabitModal'
import { useTodoStore } from '../store/todoStore'
import TodoList from '../components/todo/TodoList'
import TodoModal from '../components/todo/TodoModal'
import RolloverBanner from '../components/today/RolloverBanner'
import type { Todo } from '../types'
import WeeklyView from '../components/today/WeeklyView'

type TabType = '일일' | '주간'

export default function Today() {
  const { todos, rolloverTodos } = useTodoStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('일일')

  const today = new Date().toISOString().split('T')[0]
  const todayTodos = todos.filter((t) => t.date === today)
  const completedCount = todayTodos.filter((t) => t.isCompleted).length
  const progressPercent = todayTodos.length === 0 ? 0 : (completedCount / todayTodos.length) * 100

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditTodo(null)
  }

    useEffect(() => {
    rolloverTodos()
    }, [])

  return (
    <>
      {/* 헤더 */}
      <header className="bg-[#a4a4c4] pt-4 pb-6 px-4 rounded-b-[24px]">
        
        {/* 타이틀 */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white font-bold text-xl px-2">퀘스트</h1>
          <div className="flex items-center gap-2 bg-[#3b3b55]/80 text-white pl-2 pr-4 py-1.5 rounded-full text-sm">
            <span className="material-symbols-outlined text-yellow-300 text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              bolt
            </span>
            <span className="font-bold">{completedCount}</span>
            <span className="text-white/50">/</span>
            <span className="font-bold">{todayTodos.length}</span>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex bg-white rounded-lg overflow-hidden h-12 shadow-sm mb-4">
          {(['일일', '주간'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 font-bold text-sm transition-colors ${
                activeTab === tab
                  ? 'game-tab-active'
                  : 'text-[#a4a4c4] border-r border-[#eee] last:border-r-0'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 진행률 바 */}
        <div className="px-2">
          <div className="flex justify-between text-[12px] font-bold text-white/80 mb-1.5">
            <span>오늘 진행률</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 to-cyan-300 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/60 mt-1">
            <span>완료 {completedCount}개</span>
            <span>전체 {todayTodos.length}개</span>
          </div>
        </div>

      </header>

      {/* 메인 */}
      <main className="px-4 mt-5 space-y-4 max-w-2xl mx-auto">

    {/* 이월 배너 */}
    <RolloverBanner todos={todos} />

    {/* 탭 콘텐츠 */}
    {activeTab === '일일' && (
  <>
    {/* 일일 퀘스트 */}
    <div className="mb-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[16px]">⚔️</span>
        <span className="font-bold text-[15px] text-[#4a443a]">일일 퀘스트</span>
      </div>
      <TodoList todos={todayTodos} onEdit={handleEdit} />
    </div>

    {/* 구분선 */}
    <div className="flex items-center gap-3 my-4">
      <div className="flex-grow h-px bg-[#eee]" />
      <span className="text-[11px] font-bold text-[#c4bfb4]">HABIT QUEST</span>
      <div className="flex-grow h-px bg-[#eee]" />
    </div>

    {/* 습관 퀘스트 */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[16px]">🔥</span>
          <span className="font-bold text-[15px] text-[#4a443a]">습관 퀘스트</span>
        </div>
        <button
          onClick={() => setIsHabitModalOpen(true)}
          className="bouncy-button text-[12px] font-bold text-[#a4a4c4] flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          추가
        </button>
      </div>
      <HabitList date={today} onAdd={() => setIsHabitModalOpen(true)} />
    </div>
  </>
    )}
    {activeTab === '주간' && <WeeklyView />}

      </main>

      {/* 추가 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bouncy-button fixed bottom-28 right-5 w-14 h-14 bg-[#a4a4c4] rounded-2xl flex items-center justify-center shadow-lg"
      >
        <img
            src="/icons/fi-rs-plus.png"
            alt="+"
            className="w-6 h-6"
        />
      </button>

      {/* 모달 */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleClose}
        editTodo={editTodo}
        date={today}
      />

      {/* 습관 모달 추가 */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
      />
    </>
  )
}
import { useEffect, useState } from 'react'
import HabitList from '../components/habit/HabitList'
import HabitModal from '../components/habit/HabitModal'
import { useTodoStore } from '../store/todoStore'
import TodoList from '../components/todo/TodoList'
import TodoModal from '../components/todo/TodoModal'
import RolloverBanner from '../components/today/RolloverBanner'
import type { Todo,Stage } from '../types'
import WeeklyView from '../components/today/WeeklyView'
import RoutineMap from '../components/habit/RoutineMap'
import StageEditor from '../components/habit/StageEditor'
import DraggableButton from '../components/ui/DraggableButton'


type TabType = '일일' | '주간' | '습관'

export default function Today() {
  const { todos, rolloverTodos } = useTodoStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false)

    const [isStageEditorOpen, setIsStageEditorOpen] = useState(false)
    const [selectedRoutineId, setSelectedRoutineId] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(0)
    const [editStage, setEditStage] = useState<Stage | null>(null)
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
          {(['일일', '주간', '습관'] as TabType[]).map((tab) => (
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


    
  </>
    )}
    {activeTab === '주간' && <WeeklyView />}
    {activeTab === '습관' && (
    <RoutineMap
        onAddStage={(routineId, order) => {
            setSelectedRoutineId(routineId)
            setSelectedOrder(order)
            setEditStage(null)
            setIsStageEditorOpen(true)
        }}
        onEditStage={(routineId, stage) => {
            setSelectedRoutineId(routineId)
            setEditStage(stage)
            setIsStageEditorOpen(true)
        }}
    />
    )}

      </main>

      {/* 추가 버튼 */}
      <DraggableButton
        onClick={() => setIsModalOpen(true)}
        storageKey="daymind-btn-today"
      >
        <span className="material-symbols-outlined text-white text-[28px]">add</span>
      </DraggableButton>

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

      <StageEditor
        isOpen={isStageEditorOpen}
        onClose={() => {
            setIsStageEditorOpen(false)
            setEditStage(null)
        }}
        routineId={selectedRoutineId}
        order={selectedOrder}
        editStage={editStage}
        />
    </>

    
  )

  
}
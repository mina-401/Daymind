import { useEffect, useState } from 'react'

import { useTodoStore } from '../store/todoStore'
import { useRoutineStore } from '../store/routineStore'
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

  const [isStageEditorOpen, setIsStageEditorOpen] = useState(false)
  const [selectedRoutineId, setSelectedRoutineId] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(0)
  const [editStage, setEditStage] = useState<Stage | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('일일')
  const { routines, getTotalXP } = useRoutineStore()

  const today = new Date().toISOString().split('T')[0]
  const todayTodos = todos.filter((t) => t.date === today)
  const completedCount = todayTodos.filter((t) => t.isCompleted).length

  const routineXP = routines.reduce((acc, r) => acc + getTotalXP(r.id), 0)
  const totalXP = completedCount * 10 + routineXP
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
    <header className="app-header px-5 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
            style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-primary-border)' }}>
            <span className="material-symbols-outlined text-[20px]"
              style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
              Checklist
            </span>
          </div>
          <h1 className="font-bold text-xl" style={{ color: 'var(--color-primary)' }}>퀘스트</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2"
          style={{ backgroundColor: 'var(--color-surface-container)', borderColor: 'var(--color-primary-container)' }}>
          <span className="material-symbols-outlined text-[16px]"
            style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
          <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
            {totalXP} xp
          </span>
        </div>
      </div>
    </header>

    {/* 탭 + 진행률 */}
    <div className="px-5 pt-4 pb-2 max-w-2xl mx-auto">
      {/* 탭 */}
      <div className="tab-nav flex gap-2 mb-4">
        {(['일일', '주간', '습관'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 font-bold text-sm transition-all ${
              activeTab === tab ? 'tab-active' : 'tab-inactive'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 진행 로드맵 */}
    {activeTab === '일일' && (
      <div className="rounded-[32px] p-5 mb-2 border"
        style={{ backgroundColor: 'white', borderColor: 'var(--color-primary-container)' }}>

        {/* 타이틀 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[15px]" style={{ color: 'var(--color-primary)' }}>
            오늘의 진행도
          </h3>
          <span className="text-[11px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: 'var(--color-tertiary-container)', color: 'var(--color-tertiary)' }}>
            {Math.round(progressPercent)}% 완료
          </span>
        </div>

        {/* 진행바 */}
        <div className="relative pt-2 pb-2">
          <div className="progress-track h-4 w-full">
            <div
              className="progress-fill h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

            {/* 마일스톤 */}

            <div className="flex justify-between mt-3">
              {todayTodos.length === 0 ? (
                <div className="w-full text-center">
                  <span className="text-[11px] font-bold" style={{ color: 'var(--color-text-light)' }}>
                    할일을 추가하면 마일스톤이 생성돼요!
                  </span>
                </div>
              ) : (
                [...todayTodos, null].map((_, idx) => {
                  const milestoneXP = idx * 10
                  const currentXP = completedCount * 10
                  const isReached = currentXP >= milestoneXP
                  const isLast = idx === todayTodos.length

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{
                          color: isReached
                            ? isLast ? 'var(--color-primary)' : '#dcc66e'
                            : 'var(--color-text-light)',
                          fontVariationSettings: isReached ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        {isLast ? 'redeem' : 'inventory_2'}
                      </span>
                      <span className="text-[10px] font-bold"
                        style={{ color: isReached ? 'var(--color-primary)' : 'var(--color-text-light)' }}>
                        {milestoneXP}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* 남은 할일 */}
          <div className="flex justify-center mt-3">
            <span className="text-[12px] font-bold"
              style={{ color: 'var(--color-text-muted)' }}>
              {todayTodos.length === 0
                ? '할일을 추가해보세요!'
                : completedCount === todayTodos.length
                ? '🎉 오늘 퀘스트 완료!'
                : `${todayTodos.length - completedCount}개 남음`}
            </span>
          </div>

      </div>
    )}
    </div>

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


      {/* 모달 */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleClose}
        editTodo={editTodo}
        date={today}
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

        {/* 추가 버튼 */}
        <DraggableButton
          onClick={() => setIsModalOpen(true)}
          storageKey="daymind-btn-today"
        >
          <span className="material-symbols-outlined text-white text-[28px]">add</span>
        </DraggableButton>
    </>

    
  )

  
}
export type EnergyLevel = 'low' | 'medium' | 'high'

export type Todo = {
  id: string
  title: string
  date: string
  isCompleted: boolean
  energy: EnergyLevel
  rolledOver: boolean
  memoId?: string
  timerSeconds?: number
  startTime?: string     
  endTime?: string        
  createdAt: string
}

export type Memo = {
  id: string
  title: string
  content: string
  linkedTodoId?: string   // 연결된 할일 id (선택)
  updatedAt: string
  createdAt: string
}

export type TimerSession = {
  id: string
  todoId?: string         // 어떤 할일에 집중했는지 (선택)
  duration: number        // 집중한 시간 (초)
  completedAt: string
}
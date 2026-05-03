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
  date?: string           
  linkedTodoId?: string
  updatedAt: string
  createdAt: string
}

export type TimerSession = {
  id: string
  todoId?: string        
  duration: number        
  completedAt: string
}

export type Habit = {
  id: string
  title: string
  icon: string           
  createdAt: string
}

export type HabitRecord = {
  id: string
  habitId: string      
  date: string           
  isCompleted: boolean
}
// 스테이지 (미션 하나)
export type Stage = {
  id: string
  title: string
  icon: string
  targetDays: number     
  rewardXP: number        
  order: number        
  parallelGroup?: string  
  createdAt: string
}

// 스테이지 진행 기록
export type StageRecord = {
  id: string
  stageId: string
  date: string            
  isCompleted: boolean
}

// 루틴 (스테이지들의 묶음)
export type Routine = {
  id: string
  title: string
  stages: Stage[]
  totalXP: number         // 누적 경험치
  createdAt: string
}
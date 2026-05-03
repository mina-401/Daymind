export type EnergyLevel = 'low' | 'medium' | 'high'

// 할 일 (Todo)
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

// 메모 (Memo)
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

export type Stage = {
  id: string
  title: string
  icon: string
  rewardXP: number
  order: number        
  parallelGroup?: string  
  createdAt: string
}

export type StageRecord = {
  id: string
  stageId: string
  date: string            
  isCompleted: boolean
}

export type Routine = {
  id: string
  title: string
  targetDays: number      // ← 추가 (루틴 전체 목표일수)
  stages: Stage[]
  totalXP: number
  createdAt: string
}
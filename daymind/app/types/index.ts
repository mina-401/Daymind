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
  linkedTodoId?: string   
  updatedAt: string
  createdAt: string
}

export type TimerSession = {
  id: string
  todoId?: string        
  duration: number        
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
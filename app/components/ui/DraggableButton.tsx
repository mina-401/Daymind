import { useState, useEffect, useRef } from 'react'

type Props = {
  onClick: () => void
  storageKey: string
  children: React.ReactNode
}

export default function DraggableButton({ onClick, storageKey, children }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const position = useRef({ x: 0, y: 0 })
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const hasMoved = useRef(false)
  const [mounted, setMounted] = useState(false)

  // 초기 위치 설정
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      position.current = JSON.parse(saved)
    } else {
      position.current = {
        x: window.innerWidth - 80,
        y: window.innerHeight - 160,
      }
    }
    setMounted(true)
  }, [])

  // DOM에 직접 위치 적용
  const applyPosition = (x: number, y: number) => {
    if (!buttonRef.current) return
    buttonRef.current.style.left = `${x}px`
    buttonRef.current.style.top = `${y}px`
  }

  // 마우스
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    hasMoved.current = false
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...position.current }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved.current = true
      const x = Math.min(Math.max(0, posStart.current.x + dx), window.innerWidth - 64)
      const y = Math.min(Math.max(0, posStart.current.y + dy), window.innerHeight - 160)
      position.current = { x, y }
      applyPosition(x, y)
    }

    const handleMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      localStorage.setItem(storageKey, JSON.stringify(position.current))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // 터치
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    isDragging.current = true
    hasMoved.current = false
    dragStart.current = { x: touch.clientX, y: touch.clientY }
    posStart.current = { ...position.current }
  }

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      e.preventDefault()
      const touch = e.touches[0]
      const dx = touch.clientX - dragStart.current.x
      const dy = touch.clientY - dragStart.current.y
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved.current = true
      const x = Math.min(Math.max(0, posStart.current.x + dx), window.innerWidth - 64)
      const y = Math.min(Math.max(0, posStart.current.y + dy), window.innerHeight - 160)
      position.current = { x, y }
      applyPosition(x, y)
    }

    const handleTouchEnd = () => {
      if (!isDragging.current) return
      isDragging.current = false
      localStorage.setItem(storageKey, JSON.stringify(position.current))
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  const handleClick = () => {
    if (!hasMoved.current) onClick()
  }

  if (!mounted) return null

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      className="bouncy-button fixed w-14 h-14 bg-[#a4a4c4] rounded-2xl flex items-center justify-center shadow-lg z-30 cursor-grab active:cursor-grabbing active:scale-110"
      style={{
        left: position.current.x,
        top: position.current.y,
        willChange: 'left, top',
      }}
    >
      {children}
    </button>
  )
}

// 전  →  useState로 position 관리
//        position 바뀔때마다 리렌더링 → 버벅임

// 후  →  useRef로 position 관리
//        DOM 직접 조작 (style.left, style.top)
//        리렌더링 없음 → 부드러움 
//        willChange: 'left, top' → GPU 가속 
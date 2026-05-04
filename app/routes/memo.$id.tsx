import { useParams, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useMemoStore } from '../store/memoStore'
import { useTodoStore } from '../store/todoStore'
import type { EnergyLevel } from '../types'

type AIResult =
  | { type: 'summary'; text: string }
  | { type: 'todos'; items: string[] }
  | null

export default function MemoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { memos, updateMemo, deleteMemo } = useMemoStore()
  const { addTodo } = useTodoStore()

  const memo = memos.find((m) => m.id === id)

  const [title, setTitle] = useState(memo?.title ?? '')
  const [content, setContent] = useState(memo?.content ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [aiResult, setAiResult] = useState<AIResult>(null)
  const [isSaved, setIsSaved] = useState(true)

  useEffect(() => {
    if (!memo) navigate('/memo')
  }, [memo])

  useEffect(() => {
    if (!id) return
    setIsSaved(false)
    const timer = setTimeout(() => {
      updateMemo(id, { title, content })
      setIsSaved(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [title, content])

  const handleDelete = () => {
    if (!id) return
    deleteMemo(id)
    navigate('/memo')
  }

  const callClaude = async (prompt: string) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await res.json()
    return data.content[0].text as string
  }

  const handleSummary = async () => {
    if (!content.trim()) return
    setIsLoading(true)
    setAiResult(null)
    try {
      const text = await callClaude(
        `다음 메모를 3줄 이내로 핵심만 간결하게 요약해줘. 한국어로 답해:\n\n${content}`
      )
      setAiResult({ type: 'summary', text })
    } catch {
      alert('오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExtractTodos = async () => {
    if (!content.trim()) return
    setIsLoading(true)
    setAiResult(null)
    try {
      const text = await callClaude(
        `다음 메모에서 해야 할 일(To-do)만 추출해줘. 
        반드시 아래 형식으로만 답해 (다른 말 없이):
        - 할일1
        - 할일2
        메모:\n\n${content}`
      )
      const items = text
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace(/^-\s*/, '').trim())
        .filter(Boolean)
      setAiResult({ type: 'todos', items })
    } catch {
      alert('오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTodo = (todoTitle: string) => {
    const today = new Date().toISOString().split('T')[0]
    addTodo(todoTitle, today, 'medium' as EnergyLevel)
  }

  if (!memo) return null

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>

      {/* 헤더 */}
      <header className="app-header px-5 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/memo')}
            className="bouncy-button flex items-center gap-1.5"
            style={{ color: 'var(--color-primary)' }}
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            <span className="font-bold text-[14px]">데일리 로그</span>
          </button>

          <div className="flex items-center gap-2">
            {/* 저장 상태 */}
            <span className="text-[11px] font-bold"
              style={{ color: isSaved ? 'var(--color-tertiary)' : 'var(--color-text-light)' }}>
              {isSaved ? '저장됨 ✓' : '저장 중...'}
            </span>

            {/* 삭제 버튼 */}
            <button
              onClick={handleDelete}
              className="bouncy-button flex items-center gap-1 px-3 py-1.5 rounded-full border-2"
              style={{
                backgroundColor: 'var(--color-error-container)',
                borderColor: '#fca5a5',
                color: 'var(--color-error)',
              }}
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              <span className="font-bold text-[13px]">삭제</span>
            </button>
          </div>
        </div>
      </header>

      {/* 편집 영역 */}
      <main className="flex-grow px-5 pt-6 pb-48 max-w-2xl mx-auto w-full">

        {/* 제목 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full text-[22px] font-bold bg-transparent outline-none mb-4"
          style={{ color: 'var(--color-text)', caretColor: 'var(--color-primary)' }}
        />

        <div className="h-px mb-4" style={{ backgroundColor: 'var(--color-primary-container)' }} />

        {/* 내용 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          className="w-full text-[15px] bg-transparent outline-none resize-none leading-relaxed"
          style={{
            minHeight: 'calc(100vh - 320px)',
            color: 'var(--color-text)',
            caretColor: 'var(--color-primary)',
          }}
        />

        {/* AI 결과 */}
        {aiResult && (
          <div className="rounded-[28px] border-2 p-5 mt-4"
            style={{
              backgroundColor: 'var(--color-primary-container)',
              borderColor: 'var(--color-primary-border)',
            }}>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px]"
                style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span className="text-[12px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-primary)' }}>
                {aiResult.type === 'summary' ? 'AI 요약' : 'AI 할일 추출'}
              </span>
            </div>

            {aiResult.type === 'summary' && (
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {aiResult.text}
              </p>
            )}

            {aiResult.type === 'todos' && (
              <div className="space-y-2">
                {aiResult.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <span className="text-[14px] flex-grow" style={{ color: 'var(--color-text)' }}>
                      {item}
                    </span>
                    <button
                      onClick={() => handleAddTodo(item)}
                      className="bouncy-button flex-shrink-0 text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      + 할일 추가
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 하단 AI 버튼 */}
      <div className="fixed bottom-6 left-0 w-full px-5">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <button
            onClick={handleSummary}
            disabled={isLoading || !content.trim()}
            className="bouncy-button flex-1 flex items-center justify-center gap-2 rounded-[28px] py-3.5 font-bold text-[13px] border-2 disabled:opacity-40"
            style={{
              backgroundColor: 'white',
              borderColor: 'var(--color-primary-container)',
              color: 'var(--color-primary)',
            }}
          >
            <span className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            {isLoading ? '처리 중...' : '요약하기'}
          </button>
          <button
            onClick={handleExtractTodos}
            disabled={isLoading || !content.trim()}
            className="bouncy-button flex-1 flex items-center justify-center gap-2 rounded-[28px] py-3.5 font-bold text-[13px] disabled:opacity-40"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <span className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              checklist
            </span>
            {isLoading ? '처리 중...' : '할일 추출'}
          </button>
        </div>
      </div>

    </div>
  )
}
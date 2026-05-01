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

  useEffect(() => {
    if (!memo) navigate('/memo')
  }, [memo])

  useEffect(() => {
    if (!id) return
    const timer = setTimeout(() => {
      updateMemo(id, { title, content })
    }, 1000)
    return () => clearTimeout(timer)
  }, [title, content])

  const handleDelete = () => {
    if (!id) return
    deleteMemo(id)
    navigate('/memo')
  }

  // Claude API 호출
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

  // 요약하기
  const handleSummary = async () => {
    if (!content.trim()) return
    setIsLoading(true)
    setAiResult(null)
    try {
      const text = await callClaude(
        `다음 메모를 3줄 이내로 핵심만 간결하게 요약해줘. 한국어로 답해:\n\n${content}`
      )
      setAiResult({ type: 'summary', text })
    } catch (e) {
      alert('오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  // 할일 추출
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
        - 할일3
        
        메모:\n\n${content}`
      )
      const items = text
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace(/^-\s*/, '').trim())
        .filter(Boolean)
      setAiResult({ type: 'todos', items })
    } catch (e) {
      alert('오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  // 추출된 할일 추가
  const handleAddTodo = (todoTitle: string) => {
    const today = new Date().toISOString().split('T')[0]
    addTodo(todoTitle, today, 'medium' as EnergyLevel)
  }

  if (!memo) return null

  return (
    <div className="min-h-screen flex flex-col">

      {/* 헤더 */}
      <header className="bg-[#a4a4c4] pt-4 pb-6 px-4 rounded-b-[24px]">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/memo')}
            className="bouncy-button flex items-center gap-1 text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            <span className="font-bold text-[14px]">메모</span>
          </button>
          <button
            onClick={handleDelete}
            className="bouncy-button flex items-center gap-1 bg-[#3b3b55]/80 text-white pl-3 pr-4 py-1.5 rounded-full text-sm"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            <span className="font-bold text-[13px]">삭제</span>
          </button>
        </div>
      </header>

      {/* 편집 영역 */}
      <main className="flex-grow px-5 pt-6 pb-48 max-w-2xl mx-auto w-full">

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full text-[22px] font-bold text-[#4a443a] placeholder-[#c4bfb4] bg-transparent outline-none mb-4"
        />

        <div className="h-px bg-[#eee] mb-4" />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요..."
          className="w-full text-[15px] text-[#4a443a] placeholder-[#c4bfb4] bg-transparent outline-none resize-none leading-relaxed"
          style={{ minHeight: 'calc(100vh - 320px)' }}
        />

        {/* AI 결과 */}
        {aiResult && (
          <div className="bg-[#eee8d5] border border-[#dcd7c5] rounded-2xl p-4 mt-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[16px] text-[#8c7a2e]"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span className="text-[12px] font-bold text-[#8c7a2e] uppercase tracking-wider">
                {aiResult.type === 'summary' ? 'AI 요약' : 'AI 할일 추출'}
              </span>
            </div>

            {aiResult.type === 'summary' && (
              <p className="text-[14px] text-[#4a443a] leading-relaxed">{aiResult.text}</p>
            )}

            {aiResult.type === 'todos' && (
              <div className="space-y-2">
                {aiResult.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-[#4a443a] flex-grow">{item}</span>
                    <button
                      onClick={() => handleAddTodo(item)}
                      className="bouncy-button flex-shrink-0 bg-[#a4a4c4] text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
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
            className="bouncy-button flex-1 flex items-center justify-center gap-2 bg-white border border-[#dcd7c5] rounded-2xl py-3.5 font-bold text-[13px] text-[#8c7a2e] disabled:opacity-40"
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
            className="bouncy-button flex-1 flex items-center justify-center gap-2 bg-[#a4a4c4] rounded-2xl py-3.5 font-bold text-[13px] text-white disabled:opacity-40"
          >
            <img
              src="/icons/fi-rr-apps-add.png"
              alt="add"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
            {isLoading ? '처리 중...' : '할일 추출'}
          </button>
        </div>

        <div className="text-center mt-2 text-[11px] text-[#c4bfb4] font-medium">
          자동 저장 중...
        </div>
      </div>

    </div>
  )
}
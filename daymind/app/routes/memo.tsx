import { useNavigate } from 'react-router'
import { useMemoStore } from '../store/memoStore'
import MemoCard from '../components/memo/MemoCard'

export default function Memo() {
  const { memos, addMemo } = useMemoStore()
  const navigate = useNavigate()

  const handleAddMemo = () => {
    const id = crypto.randomUUID()
    addMemo('', '')
    // 방금 추가된 메모로 이동
    const newId = useMemoStore.getState().memos.at(-1)?.id
    if (newId) navigate(`/memo/${newId}`)
  }

  const sortedMemos = [...memos].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <>
      {/* 헤더 */}
      <header className="bg-[#a4a4c4] pt-4 pb-6 px-4 rounded-b-[24px]">
        <div className="flex justify-between items-center">
          <h1 className="text-white font-bold text-xl px-2">메모</h1>
          <div className="flex items-center gap-2 bg-[#3b3b55]/80 text-white pl-3 pr-4 py-1.5 rounded-full text-sm">
            <span className="material-symbols-outlined text-[16px]">notes</span>
            <span className="font-bold">{memos.length}개</span>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="px-4 mt-5 max-w-2xl mx-auto">
        {sortedMemos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#a4a4c4]">
            <span className="material-symbols-outlined text-[48px] mb-3"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              notes
            </span>
            <p className="font-bold text-[15px]">메모가 없어요</p>
            <p className="text-[13px] mt-1">아래 버튼으로 추가해보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedMemos.map((memo) => (
              <MemoCard key={memo.id} memo={memo} />
            ))}
          </div>
        )}
      </main>

      {/* 추가 버튼 */}
      <button
        onClick={handleAddMemo}
        className="bouncy-button fixed bottom-28 right-5 w-14 h-14 bg-[#a4a4c4] rounded-2xl flex items-center justify-center shadow-lg"
      >
        <span className="material-symbols-outlined text-white text-[28px]">add</span>
      </button>
    </>
  )
}
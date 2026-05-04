import { useNavigate } from 'react-router'
import { useMemoStore } from '../../store/memoStore'
import type { Memo } from '../../types'

type Props = {
  memo: Memo
}

export default function MemoCard({ memo }: Props) {
  const { deleteMemo } = useMemoStore()
  const navigate = useNavigate()

  const updatedLabel = new Date(memo.updatedAt).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      onClick={() => navigate(`/memo/${memo.id}`)}
      className="bg-white rounded-2xl p-4 border border-[#eee] cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start justify-between gap-3">
        
        {/* 내용 */}
        <div className="flex-grow min-w-0">
          <h3 className="font-bold text-[15px] text-[#4a443a] mb-1 truncate">
            {memo.title || '제목 없음'}
          </h3>
          <p className="text-[13px] text-[#a4a4c4] line-clamp-2 leading-relaxed">
            {memo.content || '내용 없음'}
          </p>
          <span className="text-[11px] text-[#c4bfb4] font-medium mt-2 block">
            {updatedLabel} 수정
          </span>
        </div>

        {/* 삭제 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            deleteMemo(memo.id)
          }}
          className="flex-shrink-0 p-2 rounded-xl hover:bg-red-50 transition-colors"
        >
          <img
            src="/icons/fi-rs-cross-small.png"
            alt="delete"
            className="w-5 h-5 opacity-60 hover:opacity-100"
          />
        </button>

      </div>
    </div>
  )
}
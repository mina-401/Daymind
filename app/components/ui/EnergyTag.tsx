import type { EnergyLevel } from '../../types'

type Props = {
  energy: EnergyLevel
}

const energyConfig = {
  high: {
    label: '고에너지',
    color: 'bg-red-100 text-red-500 border-red-200',
    dot: 'bg-red-400',
  },
  medium: {
    label: '중에너지',
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    dot: 'bg-yellow-400',
  },
  low: {
    label: '저에너지',
    color: 'bg-green-100 text-green-600 border-green-200',
    dot: 'bg-green-400',
  },
}

export default function EnergyTag({ energy }: Props) {
  const config = energyConfig[energy]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
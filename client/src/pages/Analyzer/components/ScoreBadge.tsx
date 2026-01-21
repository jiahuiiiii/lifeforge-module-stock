import { Icon } from '@iconify/react'
import clsx from 'clsx'

interface ScoreBadgeProps {
  score: number
  maxScore?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

function getScoreLevel(
  score: number,
  maxScore: number
): 'high' | 'medium' | 'low' {
  const ratio = score / maxScore

  if (ratio >= 0.7) return 'high'
  if (ratio >= 0.4) return 'medium'

  return 'low'
}

export default function ScoreBadge({
  score,
  maxScore = 50,
  size = 'md',
  showLabel = true
}: ScoreBadgeProps) {
  const level = getScoreLevel(score, maxScore)

  const colorClasses = {
    high: 'bg-green-500/20 text-green-500 border-green-500/50',
    medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
    low: 'bg-red-500/20 text-red-500 border-red-500/50'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }

  const iconMap = {
    high: 'tabler:check',
    medium: 'tabler:minus',
    low: 'tabler:x'
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        colorClasses[level],
        sizeClasses[size]
      )}
    >
      <Icon className="size-3.5" icon={iconMap[level]} />
      {showLabel && <span>{score} pts</span>}
    </span>
  )
}

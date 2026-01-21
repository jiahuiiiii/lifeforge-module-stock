import clsx from 'clsx'
import { TagChip } from 'lifeforge-ui'
import COLORS from 'tailwindcss/colors'

interface ScoreBadgeProps {
  score: number
  maxScore?: number
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

const COLOR_MAP = {
  high: COLORS['green'][500],
  medium: COLORS['yellow'][500],
  low: COLORS['red'][500]
}

const ICON_MAP = {
  high: 'tabler:check',
  medium: 'tabler:minus',
  low: 'tabler:x'
}

export default function ScoreBadge({ score, maxScore = 50 }: ScoreBadgeProps) {
  const level = getScoreLevel(score, maxScore)

  return (
    <TagChip
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold'
      )}
      color={COLOR_MAP[level]}
      icon={ICON_MAP[level]}
      label={`${score} pts`}
    />
  )
}

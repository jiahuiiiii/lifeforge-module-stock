import { COLORS } from '@lifeforge/ui'

export type Mood = 'bullish' | 'neutral' | 'bearish' | 'excited' | 'anxious'

export const MOODS: Mood[] = [
  'bullish',
  'neutral',
  'bearish',
  'excited',
  'anxious'
]

export const MOOD_CONFIG: Record<
  Mood,
  { icon: string; labelKey: string; color: string }
> = {
  bullish: {
    icon: 'tabler:trending-up',
    labelKey: 'diary.moods.bullish',
    color: COLORS['green-500']
  },
  neutral: {
    icon: 'tabler:minus',
    labelKey: 'diary.moods.neutral',
    color: COLORS['gray-500']
  },
  bearish: {
    icon: 'tabler:trending-down',
    labelKey: 'diary.moods.bearish',
    color: COLORS['red-500']
  },
  excited: {
    icon: 'tabler:flame',
    labelKey: 'diary.moods.excited',
    color: COLORS['orange-500']
  },
  anxious: {
    icon: 'tabler:alert-triangle',
    labelKey: 'diary.moods.anxious',
    color: COLORS['yellow-500']
  }
}

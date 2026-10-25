import { COLORS } from '@lifeforge/ui'

export const VERDICTS = {
  PASS: {
    icon: 'tabler:check',
    label: 'Invest',
    color: COLORS['green-500']
  },
  NEUTRAL: {
    icon: 'tabler:alert-circle',
    label: 'Watch',
    color: COLORS['yellow-500']
  },
  FAIL: {
    icon: 'tabler:x',
    label: 'Reject',
    color: COLORS['red-500']
  }
} as const

export function getVerdict(
  gdpScore?: number,
  prcScore?: number
): keyof typeof VERDICTS {
  if (!gdpScore || !prcScore) return 'NEUTRAL'

  const gdpPass = gdpScore >= 50

  const prcPass = prcScore >= 50

  if (gdpPass && prcPass) return 'PASS'
  if (gdpPass || prcPass) return 'NEUTRAL'

  return 'FAIL'
}

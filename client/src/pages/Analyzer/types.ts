import COLORS from 'tailwindcss/colors'

export const CASH_FLOW_OPTIONS = [
  { value: 'profit_inflow', label: 'Profit + Net Inflow' },
  { value: 'profit_outflow', label: 'Profit + Net Outflow' },
  { value: 'loss_inflow', label: 'Loss + Net Inflow' },
  { value: 'loss_outflow', label: 'Loss + Net Outflow' }
] as const

export type CashFlowOption = (typeof CASH_FLOW_OPTIONS)[number]['value']

export const VERDICTS = {
  PASS: {
    icon: 'tabler:check',
    label: 'Invest',
    color: COLORS.green[500]
  },
  NEUTRAL: {
    icon: 'tabler:alert-circle',
    label: 'Watch',
    color: COLORS.yellow[500]
  },
  FAIL: {
    icon: 'tabler:x',
    label: 'Reject',
    color: COLORS.red[500]
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

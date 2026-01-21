import COLORS from 'tailwindcss/colors'

export type MetricId = 'cagr' | 'dy' | 'pe' | 'margin' | 'roe' | 'cashflow'

export interface ScoringTier {
  threshold: number
  score: number
}

export interface MetricConfig {
  id: MetricId
  label: string
  unit: '%' | 'x' | 'pts'
  // For most metrics: higher value = lower threshold index
  // For PE: lower value = better (inverse)
  isInverse?: boolean
  tiers: ScoringTier[]
}

export interface ScoringSettings {
  cagr: MetricConfig
  dy: MetricConfig
  pe: MetricConfig
  margin: MetricConfig
  roe: MetricConfig
  cashflow: MetricConfig
}

export type CashFlowOption =
  | 'profit_inflow'
  | 'profit_outflow'
  | 'loss_inflow'
  | 'loss_outflow'

export const CASH_FLOW_OPTIONS: {
  value: CashFlowOption
  label: string
}[] = [
  { value: 'profit_inflow', label: 'Profit + Net Inflow' },
  { value: 'profit_outflow', label: 'Profit + Net Outflow' },
  { value: 'loss_inflow', label: 'Loss + Net Inflow' },
  { value: 'loss_outflow', label: 'Loss + Net Outflow' }
]

export const DEFAULT_CASH_FLOW_SCORES: Record<CashFlowOption, number> = {
  profit_inflow: 40,
  profit_outflow: 30,
  loss_inflow: 20,
  loss_outflow: 1
}

export interface StockLog {
  id: string
  ticker: string
  stockExchange?: string
  companyName?: string
  date: string

  // Input values snapshot
  cagrValue: number
  dyValue: number
  peValue: number
  marginValue: number
  roeValue: number
  cashFlowOption: CashFlowOption

  // Calculated scores
  gdpScore: number // G + D + P
  prcScore: number // P + R + C
  totalScore: number

  // Qualitative checks
  passedZulu: boolean
  undervaluedPe: boolean

  // Qualitative gate confirmation
  qualitativeChecks: {
    valueChain: boolean
    dividendPolicy: boolean
    management: boolean
    moat: boolean
  }
}

export type Verdict = 'PASS' | 'NEUTRAL' | 'FAIL'

export function getVerdict(gdpScore: number, prcScore: number): Verdict {
  const gdpPass = gdpScore >= 50

  const prcPass = prcScore >= 50

  if (gdpPass && prcPass) return 'PASS'
  if (gdpPass || prcPass) return 'NEUTRAL'

  return 'FAIL'
}

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
}

// Calculator log types - stores all calculator values together
export interface CalculatorLog {
  id: string
  ticker: string
  name?: string
  exchange?: string
  date: string

  // Calculator values
  cagr?: number
  cagrScore?: number
  dy?: number
  dyScore?: number
  pe?: number
  peScore?: number
  margin?: number
  marginScore?: number
  roe?: number
  roeScore?: number

  // Total score from all calculators
  totalScore: number
}

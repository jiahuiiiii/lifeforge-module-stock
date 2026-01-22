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
  cashFlowOption: string

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

import type { CashFlowOption } from '../../constants/cashFlow'

export type QualitativeChecks = {
  valueChain: boolean
  dividendPolicy: boolean
  management: boolean
  moat: boolean
}

export type BaseInfo = {
  ticker: string
  stockExchange: string
  companyName: string
}

export type RawValues = {
  cagr: number
  dy: number
  pe: number
  margin: number
  roe: number
  cashFlow: CashFlowOption
  avgPE: number
}

export type DerivedValues = {
  cagrScore: number
  dyScore: number
  peScore: number
  marginScore: number
  roeScore: number
  cashFlowScore: number
  gdpScore: number
  prcScore: number
  passedZulu: boolean
  undervaluedPE: boolean
}

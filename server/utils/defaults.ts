export interface ScoringTier {
  threshold: number
  score: number
}

export type CashFlowOption =
  | 'profit_inflow'
  | 'profit_outflow'
  | 'loss_inflow'
  | 'loss_outflow'

export interface MetricConfig {
  label: string
  unit: '%' | 'x' | 'pts'
  isInverse?: boolean
  tiers: ScoringTier[] | Record<CashFlowOption, number>
}

export interface ScoringSettings {
  cagr: MetricConfig
  dy: MetricConfig
  pe: MetricConfig
  margin: MetricConfig
  roe: MetricConfig
  cashflow: MetricConfig
}

// Default "Cold Eye" scoring thresholds
export const DEFAULT_SETTINGS: ScoringSettings = {
  cagr: {
    label: 'CAGR (Growth)',
    unit: '%',
    tiers: [
      { threshold: 15, score: 50 },
      { threshold: 10, score: 40 },
      { threshold: 6, score: 30 },
      { threshold: 1, score: 20 }
    ]
  },
  dy: {
    label: 'Dividend Yield',
    unit: '%',
    tiers: [
      { threshold: 7, score: 20 },
      { threshold: 5, score: 15 },
      { threshold: 3, score: 10 },
      { threshold: 1, score: 5 }
    ]
  },
  pe: {
    label: 'PE Ratio',
    unit: 'x',
    isInverse: true, // Lower PE is better
    tiers: [
      { threshold: 9, score: 30 },
      { threshold: 15, score: 20 },
      { threshold: 24, score: 10 },
      { threshold: 999999, score: 0 }
    ]
  },
  margin: {
    label: 'Net Profit Margin',
    unit: '%',
    tiers: [
      { threshold: 16, score: 20 },
      { threshold: 11, score: 15 },
      { threshold: 6, score: 10 },
      { threshold: 1, score: 0 }
    ]
  },
  roe: {
    label: 'ROE',
    unit: '%',
    tiers: [
      { threshold: 16, score: 20 },
      { threshold: 11, score: 15 },
      { threshold: 6, score: 10 },
      { threshold: 1, score: 0 }
    ]
  },
  cashflow: {
    label: 'Cash Flow Status',
    unit: 'pts',
    tiers: {
      profit_inflow: 40,
      profit_outflow: 30,
      loss_inflow: 20,
      loss_outflow: 1
    }
  }
}

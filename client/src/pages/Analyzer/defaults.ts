import type { ScoringSettings } from './types'

// Default "Cold Eye" scoring thresholds
export const DEFAULT_SETTINGS: ScoringSettings = {
  cagr: {
    id: 'cagr',
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
    id: 'dy',
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
    id: 'pe',
    label: 'PE Ratio',
    unit: 'x',
    isInverse: true, // Lower PE is better
    tiers: [
      { threshold: 9, score: 30 },
      { threshold: 15, score: 20 },
      { threshold: 24, score: 10 },
      { threshold: Infinity, score: 0 }
    ]
  },
  margin: {
    id: 'margin',
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
    id: 'roe',
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
    id: 'cashflow',
    label: 'Cash Flow Status',
    unit: 'pts',
    tiers: [
      // Cash flow uses dropdown selection, not threshold-based scoring
      { threshold: 0, score: 40 }
    ]
  }
}

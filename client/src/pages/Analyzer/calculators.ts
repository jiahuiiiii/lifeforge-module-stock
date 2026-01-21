import type { MetricConfig } from './types'

export function parseShorthand(value: string): number {
  if (!value) return NaN

  const cleaned = value.replace(/,/g, '').replace(/\s/g, '').toLowerCase()

  if (!cleaned) return NaN

  let isNegative = false
  let numStr = cleaned

  if (cleaned.startsWith('-')) {
    isNegative = true
    numStr = cleaned.slice(1)
  }

  const lastChar = numStr.slice(-1)

  const multipliers: Record<string, number> = {
    k: 1_000,
    m: 1_000_000,
    b: 1_000_000_000
  }

  let result: number

  if (multipliers[lastChar]) {
    const numPart = numStr.slice(0, -1)

    const num = parseFloat(numPart)

    result = isNaN(num) ? NaN : num * multipliers[lastChar]
  } else {
    result = parseFloat(numStr)
  }

  return isNegative ? -result : result
}

/**
 * Calculate Compound Annual Growth Rate
 * Formula: ((End Value / Start Value) ^ (1 / years)) - 1
 * Handles negative numbers by using the sign-aware growth calculation
 */
export function calculateCAGR(
  endValue: number,
  startValue: number,
  years: number = 5
): number {
  if (startValue === 0 || years <= 0) return 0

  // For same-sign values, use standard CAGR
  if (startValue > 0 && endValue > 0) {
    return (Math.pow(endValue / startValue, 1 / years) - 1) * 100
  }

  // For mixed signs (loss to profit or profit to loss), calculate simple growth rate
  // This is a common approach when CAGR isn't mathematically defined
  const growthRate = ((endValue - startValue) / Math.abs(startValue)) * 100

  // Annualize it (simple division for approximation)
  return growthRate / years
}

/**
 * Calculate Dividend Yield
 * Formula: (Annual Dividend / Current Price) * 100
 */
export function calculateDividendYield(
  currentPrice: number,
  annualDividend: number
): number {
  if (currentPrice <= 0) return 0

  return (annualDividend / currentPrice) * 100
}

/**
 * Calculate Price-to-Earnings Ratio
 * Formula: Current Price / Earnings Per Share
 */
export function calculatePERatio(currentPrice: number, eps: number): number {
  if (eps <= 0) return Infinity

  return currentPrice / eps
}

/**
 * Calculate Profit Margin
 * Formula: (Net Income / Revenue) * 100
 */
export function calculateProfitMargin(
  netIncome: number,
  revenue: number
): number {
  if (revenue <= 0) return 0

  return (netIncome / revenue) * 100
}

/**
 * Calculate Return on Equity (ROE)
 * Formula: (Net Income / Shareholders' Equity) * 100
 */
export function calculateROE(
  netIncome: number,
  shareholdersEquity: number
): number {
  if (shareholdersEquity <= 0) return 0

  return (netIncome / shareholdersEquity) * 100
}

/**
 * Calculate PEG Ratio (Price/Earnings to Growth)
 * Formula: PE Ratio / CAGR
 * Used for Zulu Principle check
 */
export function calculatePEG(peRatio: number, cagr: number): number {
  if (cagr <= 0) return Infinity

  return peRatio / cagr
}

/**
 * Calculate Historical PE Discount
 * Formula: (1 - (Current PE / Average PE)) * 100
 * Positive = undervalued, Negative = overvalued
 */
export function calculatePEDiscount(currentPE: number, avgPE: number): number {
  if (avgPE <= 0) return 0

  return (1 - currentPE / avgPE) * 100
}

/**
 * Calculate Price-to-Sales Ratio
 * Formula: Market Cap / Total Sales (or Price / Sales Per Share)
 */
export function calculatePSRatio(
  marketCapOrPrice: number,
  totalSalesOrSalesPerShare: number
): number {
  if (totalSalesOrSalesPerShare <= 0) return Infinity

  return marketCapOrPrice / totalSalesOrSalesPerShare
}

/**
 * Get score for a value based on metric configuration
 * Handles both normal (higher is better) and inverse (lower is better) metrics
 */
export function getScore(value: number, config: MetricConfig): number {
  const { tiers, isInverse } = config

  if (isInverse) {
    // For inverse metrics (like PE), lower value gets higher tier score
    // Tiers are ordered: [10->30, 15->20, 20->10, Infinity->0]
    // Value 8 should match first tier (<=10), value 12 should match second (<=15)
    for (const tier of tiers) {
      if (value <= tier.threshold) {
        return tier.score
      }
    }

    return tiers[tiers.length - 1]?.score ?? 0
  } else {
    // For normal metrics (like CAGR), higher value gets higher tier score
    // Tiers are ordered descending: [15->50, 10->40, 5->30, 0->0]
    for (const tier of tiers) {
      if (value >= tier.threshold) {
        return tier.score
      }
    }

    return 0
  }
}

/**
 * Check if stock passes Zulu Principle
 * PEG <= 1.0 is considered a pass
 */
export function checkZuluPrinciple(peRatio: number, cagr: number): boolean {
  const peg = calculatePEG(peRatio, cagr)

  return peg <= 1.0 && isFinite(peg)
}

/**
 * Check if stock is undervalued based on historical PE
 * Discount >= 25% is considered undervalued
 */
export function checkUndervaluedPE(currentPE: number, avgPE: number): boolean {
  const discount = calculatePEDiscount(currentPE, avgPE)

  return discount >= 25
}

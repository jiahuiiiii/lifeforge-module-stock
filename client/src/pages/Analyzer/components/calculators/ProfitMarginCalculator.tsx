import { useEffect, useMemo, useState } from 'react'

import { calculateProfitMargin, getScore } from '../../calculators'
import { useAnalyzerStore } from '../../store'
import CalculatorCard from '../CalculatorCard'
import ScoreBadge from '../ScoreBadge'

// Parse shorthand numbers like 100k, 1M, 2B (also handles negatives like -100k)
function parseShorthand(value: string): number {
  if (!value) return NaN

  // Remove commas and whitespace, convert to lowercase
  const cleaned = value.replace(/,/g, '').replace(/\s/g, '').toLowerCase()

  if (!cleaned) return NaN

  // Handle negative sign
  let isNegative = false

  let numStr = cleaned

  if (cleaned.startsWith('-')) {
    isNegative = true
    numStr = cleaned.slice(1)
  }

  // Check for suffix (k, m, b)
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
    // No suffix, parse as regular number
    result = parseFloat(numStr)
  }

  return isNegative ? -result : result
}

interface ProfitMarginCalculatorProps {
  onValueChange?: (value: number | null, score: number) => void
}

export default function ProfitMarginCalculator({
  onValueChange
}: ProfitMarginCalculatorProps) {
  const [netIncome, setNetIncome] = useState<string>('')

  const [revenue, setRevenue] = useState<string>('')

  const settings = useAnalyzerStore(s => s.settings)

  const { margin, score } = useMemo(() => {
    const income = parseShorthand(netIncome)

    const rev = parseShorthand(revenue)

    if (isNaN(income) || isNaN(rev) || rev <= 0) {
      return { margin: null, score: 0 }
    }

    const marginValue = calculateProfitMargin(income, rev)

    const scoreValue = getScore(marginValue, settings.margin)

    return { margin: marginValue, score: scoreValue }
  }, [netIncome, revenue, settings.margin])

  // Report value changes to parent
  useEffect(() => {
    onValueChange?.(margin, score)
  }, [margin, score, onValueChange])

  return (
    <CalculatorCard
      description="Negative Numbers, k/M/B suffix supported"
      icon="tabler:chart-pie"
      result={
        margin !== null ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-bg-500 text-sm">Profit Margin</div>
              <div className="text-2xl font-bold">{margin.toFixed(2)}%</div>
            </div>
            <ScoreBadge maxScore={20} score={score} />
          </div>
        ) : (
          <div className="text-bg-500 text-center text-sm">
            Enter values to calculate
          </div>
        )
      }
      title="Profit Margin Calculator"
    >
      <div>
        <label className="text-bg-500 mb-1 block text-sm">Net Income</label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 50M, -10M, 2B"
          type="text"
          value={netIncome}
          onChange={e => setNetIncome(e.target.value)}
        />
      </div>
      <div>
        <label className="text-bg-500 mb-1 block text-sm">Total Revenue</label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 250M, 1B"
          type="text"
          value={revenue}
          onChange={e => setRevenue(e.target.value)}
        />
      </div>
    </CalculatorCard>
  )
}

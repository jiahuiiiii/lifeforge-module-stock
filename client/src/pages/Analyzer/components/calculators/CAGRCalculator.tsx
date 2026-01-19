import { useEffect, useMemo, useState } from 'react'

import { calculateCAGR, getScore } from '../../calculators'
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

interface CAGRCalculatorProps {
  onValueChange?: (value: number | null, score: number) => void
}

export default function CAGRCalculator({ onValueChange }: CAGRCalculatorProps) {
  const [startValue, setStartValue] = useState<string>('')

  const [endValue, setEndValue] = useState<string>('')

  const [years, setYears] = useState<string>('5')

  const settings = useAnalyzerStore(s => s.settings)

  const { cagr, score } = useMemo(() => {
    const start = parseShorthand(startValue)

    const end = parseShorthand(endValue)

    const y = parseFloat(years)

    if (isNaN(start) || isNaN(end) || isNaN(y) || start === 0 || y <= 0) {
      return { cagr: null, score: 0 }
    }

    const cagrValue = calculateCAGR(end, start, y)

    const scoreValue = getScore(cagrValue, settings.cagr)

    return { cagr: cagrValue, score: scoreValue }
  }, [startValue, endValue, years, settings.cagr])

  // Report value changes to parent
  useEffect(() => {
    onValueChange?.(cagr, score)
  }, [cagr, score, onValueChange])

  return (
    <CalculatorCard
      description="Negative Numbers, k/M/B suffix supported"
      icon="tabler:trending-up"
      result={
        cagr !== null ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-bg-500 text-sm">Growth Rate</div>
              <div className="text-2xl font-bold">{cagr.toFixed(2)}%</div>
            </div>
            <ScoreBadge maxScore={50} score={score} />
          </div>
        ) : (
          <div className="text-bg-500 text-center text-sm">
            Enter values to calculate
          </div>
        )
      }
      title="CAGR Calculator"
    >
      <div>
        <label className="text-bg-500 mb-1 block text-sm">
          Year N-{years || '5'} Net Profit (e.g. 2021)
        </label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 100k, 1M, 2B"
          type="text"
          value={startValue}
          onChange={e => setStartValue(e.target.value)}
        />
      </div>
      <div>
        <label className="text-bg-500 mb-1 block text-sm">
          Year N Net Profit (e.g. 2026)
        </label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 150k, 1.5M"
          type="text"
          value={endValue}
          onChange={e => setEndValue(e.target.value)}
        />
      </div>
      <div>
        <label className="text-bg-500 mb-1 block text-sm">Years</label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          max="20"
          min="1"
          type="number"
          value={years}
          onChange={e => setYears(e.target.value)}
        />
      </div>
    </CalculatorCard>
  )
}

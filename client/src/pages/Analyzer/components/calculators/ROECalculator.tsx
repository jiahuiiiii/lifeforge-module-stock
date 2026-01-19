import { useEffect, useMemo, useState } from 'react'

import { calculateROE, getScore } from '../../calculators'
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

interface ROECalculatorProps {
  onValueChange?: (value: number | null, score: number) => void
}

export default function ROECalculator({ onValueChange }: ROECalculatorProps) {
  const [netIncome, setNetIncome] = useState<string>('')

  const [equity, setEquity] = useState<string>('')

  const settings = useAnalyzerStore(s => s.settings)

  const { roe, score } = useMemo(() => {
    const income = parseShorthand(netIncome)

    const eq = parseShorthand(equity)

    if (isNaN(income) || isNaN(eq) || eq <= 0) {
      return { roe: null, score: 0 }
    }

    const roeValue = calculateROE(income, eq)

    const scoreValue = getScore(roeValue, settings.roe)

    return { roe: roeValue, score: scoreValue }
  }, [netIncome, equity, settings.roe])

  // Report value changes to parent
  useEffect(() => {
    onValueChange?.(roe, score)
  }, [roe, score, onValueChange])

  return (
    <CalculatorCard
      description="Negative Numbers, k/M/B suffix supported"
      icon="tabler:activity"
      result={
        roe !== null ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-bg-500 text-sm">Return on Equity</div>
              <div className="text-2xl font-bold">{roe.toFixed(2)}%</div>
            </div>
            <ScoreBadge maxScore={20} score={score} />
          </div>
        ) : (
          <div className="text-bg-500 text-center text-sm">
            Enter values to calculate
          </div>
        )
      }
      title="ROE Calculator"
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
        <label className="text-bg-500 mb-1 block text-sm">
          Shareholders&apos; Equity
        </label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 300M, 1.5B"
          type="text"
          value={equity}
          onChange={e => setEquity(e.target.value)}
        />
      </div>
    </CalculatorCard>
  )
}

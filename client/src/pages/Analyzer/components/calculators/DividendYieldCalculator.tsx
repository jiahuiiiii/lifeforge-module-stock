import { useEffect, useMemo, useState } from 'react'

import { calculateDividendYield, getScore } from '../../calculators'
import { useAnalyzerStore } from '../../store'
import CalculatorCard from '../CalculatorCard'
import ScoreBadge from '../ScoreBadge'

interface DividendYieldCalculatorProps {
  onValueChange?: (value: number | null, score: number) => void
}

export default function DividendYieldCalculator({
  onValueChange
}: DividendYieldCalculatorProps) {
  const [price, setPrice] = useState<string>('')

  const [dividend, setDividend] = useState<string>('')

  const settings = useAnalyzerStore(s => s.settings)

  const { dyield, score } = useMemo(() => {
    const p = parseFloat(price)

    const d = parseFloat(dividend)

    if (isNaN(p) || isNaN(d) || p <= 0) {
      return { dyield: null, score: 0 }
    }

    const yieldValue = calculateDividendYield(p, d)

    const scoreValue = getScore(yieldValue, settings.dy)

    return { dyield: yieldValue, score: scoreValue }
  }, [price, dividend, settings.dy])

  // Report value changes to parent
  useEffect(() => {
    onValueChange?.(dyield, score)
  }, [dyield, score, onValueChange])

  return (
    <CalculatorCard
      description="The unit of Price and Dividend needs to be the same (dollar/cent)"
      icon="tabler:coin"
      result={
        dyield !== null ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-bg-500 text-sm">Dividend Yield</div>
              <div className="text-2xl font-bold">{dyield.toFixed(2)}%</div>
            </div>
            <ScoreBadge maxScore={40} score={score} />
          </div>
        ) : (
          <div className="text-bg-500 text-center text-sm">
            Enter values to calculate
          </div>
        )
      }
      title="Dividend Yield Calculator"
    >
      <div>
        <label className="text-bg-500 mb-1 block text-sm">Current Price</label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 100"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label className="text-bg-500 mb-1 block text-sm">
          Annual Dividend
        </label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 4"
          type="number"
          value={dividend}
          onChange={e => setDividend(e.target.value)}
        />
      </div>
    </CalculatorCard>
  )
}

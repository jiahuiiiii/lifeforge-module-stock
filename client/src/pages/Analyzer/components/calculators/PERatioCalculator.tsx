import { useEffect, useMemo, useState } from 'react'

import { calculatePERatio, getScore } from '../../calculators'
import { useAnalyzerStore } from '../../store'
import CalculatorCard from '../CalculatorCard'
import ScoreBadge from '../ScoreBadge'

interface PERatioCalculatorProps {
  onValueChange?: (value: number | null, score: number) => void
}

export default function PERatioCalculator({
  onValueChange
}: PERatioCalculatorProps) {
  const [price, setPrice] = useState<string>('')

  const [eps, setEps] = useState<string>('')

  const settings = useAnalyzerStore(s => s.settings)

  const { peRatio, score } = useMemo(() => {
    const p = parseFloat(price)

    const e = parseFloat(eps)

    if (isNaN(p) || isNaN(e) || p <= 0 || e <= 0) {
      return { peRatio: null, score: 0 }
    }

    const pe = calculatePERatio(p, e)

    const scoreValue = getScore(pe, settings.pe)

    return { peRatio: pe, score: scoreValue }
  }, [price, eps, settings.pe])

  // Report value changes to parent
  useEffect(() => {
    onValueChange?.(peRatio, score)
  }, [peRatio, score, onValueChange])

  return (
    <CalculatorCard
      description="The unit of P/E and EPS needs to be the same (dollar/cent)"
      icon="tabler:percentage"
      result={
        peRatio !== null ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-bg-500 text-sm">PE Ratio</div>
              <div className="text-2xl font-bold">{peRatio.toFixed(2)}x</div>
            </div>
            <ScoreBadge maxScore={30} score={score} />
          </div>
        ) : (
          <div className="text-bg-500 text-center text-sm">
            Enter values to calculate
          </div>
        )
      }
      title="PE Ratio Calculator"
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
          Earnings Per Share (EPS)
        </label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 10"
          type="number"
          value={eps}
          onChange={e => setEps(e.target.value)}
        />
      </div>
    </CalculatorCard>
  )
}

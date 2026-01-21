import { CurrencyInput } from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'

import { calculatePERatio, getScore } from '../../calculators'
import { useAnalyzerStore } from '../../store'
import CalculatorCard from '../CalculatorCard'
import ScoreBadge from '../ScoreBadge'

export default function PERatioCalculator({
  onValueChange
}: {
  onValueChange?: (value: number | null, score: number) => void
}) {
  const [price, setPrice] = useState(0)

  const [eps, setEps] = useState(0)

  const settings = useAnalyzerStore(s => s.settings)

  const { peRatio, score } = useMemo(() => {
    if (price <= 0 || eps <= 0) {
      return { peRatio: null, score: 0 }
    }

    const pe = calculatePERatio(price, eps)

    const scoreValue = getScore(pe, settings.pe)

    return { peRatio: pe, score: scoreValue }
  }, [price, eps, settings.pe])

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
              <div className="text-2xl font-semibold">
                {peRatio.toFixed(2)}x
              </div>
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
      <CurrencyInput
        icon="tabler:currency-dollar"
        label="Current Price"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 100"
        value={price}
        onChange={setPrice}
      />
      <CurrencyInput
        icon="tabler:coin"
        label="Earnings Per Share (EPS)"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 10"
        value={eps}
        onChange={setEps}
      />
    </CalculatorCard>
  )
}

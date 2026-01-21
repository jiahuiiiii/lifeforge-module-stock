import { CurrencyInput } from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'

import { calculateDividendYield, getScore } from '../../calculators'
import { useAnalyzerStore } from '../../store'
import CalculatorCard from '../CalculatorCard'
import ScoreBadge from '../ScoreBadge'

export default function DividendYieldCalculator({
  onValueChange
}: {
  onValueChange?: (value: number | null, score: number) => void
}) {
  const [price, setPrice] = useState(0)

  const [dividend, setDividend] = useState(0)

  const settings = useAnalyzerStore(s => s.settings)

  const { dyield, score } = useMemo(() => {
    if (price <= 0) {
      return { dyield: null, score: 0 }
    }

    const yieldValue = calculateDividendYield(price, dividend)

    const scoreValue = getScore(yieldValue, settings.dy)

    return { dyield: yieldValue, score: scoreValue }
  }, [price, dividend, settings.dy])

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
              <div className="text-2xl font-semibold">{dyield.toFixed(2)}%</div>
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
      <CurrencyInput
        icon="tabler:currency-dollar"
        label="Current Price"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 100"
        value={price}
        onChange={setPrice}
      />
      <CurrencyInput
        icon="tabler:coins"
        label="Annual Dividend"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 4"
        value={dividend}
        onChange={setDividend}
      />
    </CalculatorCard>
  )
}

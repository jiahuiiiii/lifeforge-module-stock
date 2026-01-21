import { NumberInput, TextInput } from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'
import COLORS from 'tailwindcss/colors'

import { calculateCAGR, getScore } from '../../calculators'
import { useAnalyzerStore } from '../../store'
import CalculatorCard from '../CalculatorCard'
import ScoreBadge from '../ScoreBadge'

function parseShorthand(value: string): number {
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

export default function CAGRCalculator({
  onValueChange
}: {
  onValueChange?: (value: number | null, score: number) => void
}) {
  const [startValue, setStartValue] = useState('')

  const [endValue, setEndValue] = useState('')

  const [years, setYears] = useState(5)

  const settings = useAnalyzerStore(s => s.settings)

  const { cagr, score } = useMemo(() => {
    const start = parseShorthand(startValue)

    const end = parseShorthand(endValue)

    if (isNaN(start) || isNaN(end) || start === 0 || years <= 0) {
      return { cagr: null, score: 0 }
    }

    const cagrValue = calculateCAGR(end, start, years)

    const scoreValue = getScore(cagrValue, settings.cagr)

    return { cagr: cagrValue, score: scoreValue }
  }, [startValue, endValue, years, settings.cagr])

  useEffect(() => {
    onValueChange?.(cagr, score)
  }, [cagr, score, onValueChange])

  return (
    <CalculatorCard
      color={COLORS.lime[500]}
      description="Negative Numbers, k/M/B suffix supported"
      icon="tabler:trending-up"
      result={
        cagr !== null && (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-bg-500 text-sm">Growth Rate</div>
              <div className="text-2xl font-semibold">{cagr.toFixed(2)}%</div>
            </div>
            <ScoreBadge maxScore={50} score={score} />
          </div>
        )
      }
      title="CAGR Calculator"
    >
      <TextInput
        icon="tabler:calendar-minus"
        label={`Year N-${years} Net Profit`}
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 100k, 1M, 2B"
        value={startValue}
        onChange={setStartValue}
      />
      <TextInput
        icon="tabler:calendar"
        label="Year N Net Profit"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 150k, 1.5M"
        value={endValue}
        onChange={setEndValue}
      />
      <NumberInput
        icon="tabler:hourglass"
        label="Years"
        max={20}
        min={1}
        namespace="apps.jiahuiiiii$stock"
        value={years}
        onChange={setYears}
      />
    </CalculatorCard>
  )
}

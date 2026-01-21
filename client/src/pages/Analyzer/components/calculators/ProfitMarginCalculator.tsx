import { TextInput } from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'

import { calculateProfitMargin, getScore } from '../../calculators'
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

export default function ProfitMarginCalculator({
  onValueChange
}: {
  onValueChange?: (value: number | null, score: number) => void
}) {
  const [netIncome, setNetIncome] = useState('')

  const [revenue, setRevenue] = useState('')

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
              <div className="text-2xl font-semibold">{margin.toFixed(2)}%</div>
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
      <TextInput
        icon="tabler:wallet"
        label="Net Income"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 50M, -10M, 2B"
        value={netIncome}
        onChange={setNetIncome}
      />
      <TextInput
        icon="tabler:cash"
        label="Total Revenue"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 250M, 1B"
        value={revenue}
        onChange={setRevenue}
      />
    </CalculatorCard>
  )
}

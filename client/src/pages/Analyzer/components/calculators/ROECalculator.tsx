import { TextInput } from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'

import { calculateROE, getScore } from '../../calculators'
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

export default function ROECalculator({
  onValueChange
}: {
  onValueChange?: (value: number | null, score: number) => void
}) {
  const [netIncome, setNetIncome] = useState('')

  const [equity, setEquity] = useState('')

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
              <div className="text-2xl font-semibold">{roe.toFixed(2)}%</div>
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
      <TextInput
        icon="tabler:wallet"
        label="Net Income"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 50M, -10M, 2B"
        value={netIncome}
        onChange={setNetIncome}
      />
      <TextInput
        icon="tabler:building-bank"
        label="Shareholders' Equity"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 300M, 1.5B"
        value={equity}
        onChange={setEquity}
      />
    </CalculatorCard>
  )
}

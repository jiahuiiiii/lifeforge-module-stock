import z from 'zod'

import { calculateDividendYield, getScore } from '@/pages/Analyzer/calculators'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:coin')
  .fields(
    z.object({
      price: z.number(),
      dividend: z.number()
    })
  )
  .config({
    price: {
      type: 'currency',
      icon: 'tabler:currency-dollar',
      label: 'Current Price',
      placeholder: 'e.g., 100'
    },
    dividend: {
      type: 'currency',
      icon: 'tabler:coins',
      label: 'Annual Dividend',
      placeholder: 'e.g., 4'
    }
  })
  .result(
    z.object({
      dyield: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ price, dividend }, settings) => {
    if (price <= 0) {
      return { dyield: null, score: 0 }
    }

    const yieldValue = calculateDividendYield(price, dividend)

    const scoreValue = getScore(yieldValue, settings.dy)

    return { dyield: yieldValue, score: scoreValue }
  })
  .displayResult(
    ({ dyield, score }) =>
      dyield !== null && (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-bg-500 text-sm">Dividend Yield</div>
            <div className="text-2xl font-semibold">{dyield.toFixed(2)}%</div>
          </div>
          <ScoreBadge maxScore={40} score={score} />
        </div>
      )
  )

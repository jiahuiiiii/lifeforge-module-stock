import z from 'zod'

import { calculatePERatio, getScore } from '@/pages/Analyzer/calculators'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:percentage')
  .fields(
    z.object({
      price: z.number(),
      eps: z.number()
    })
  )
  .config({
    price: {
      type: 'currency',
      icon: 'tabler:currency-dollar',
      label: 'Current Price',
      placeholder: 'e.g., 100'
    },
    eps: {
      type: 'currency',
      icon: 'tabler:coin',
      label: 'EPS',
      placeholder: 'e.g., 10'
    }
  })
  .result(
    z.object({
      peRatio: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ price, eps }, settings) => {
    if (price <= 0 || eps <= 0) {
      return { peRatio: null, score: 0 }
    }

    const pe = calculatePERatio(price, eps)

    const scoreValue = getScore(pe, settings.pe)

    return { peRatio: pe, score: scoreValue }
  })
  .displayResult(
    ({ peRatio, score }) =>
      peRatio !== null && (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-bg-500 text-sm">PE Ratio</div>
            <div className="text-2xl font-semibold">{peRatio.toFixed(2)}x</div>
          </div>
          <ScoreBadge maxScore={30} score={score} />
        </div>
      )
  )

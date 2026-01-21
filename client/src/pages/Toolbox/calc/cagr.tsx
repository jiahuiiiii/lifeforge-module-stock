import z from 'zod'

import {
  calculateCAGR,
  getScore,
  parseShorthand
} from '@/pages/Analyzer/calculators'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:trending-up')
  .fields(
    z.object({
      startValue: z.string(),
      endValue: z.string(),
      years: z.number()
    })
  )
  .config({
    startValue: {
      icon: 'tabler:calendar-minus',
      label: 'Start Value',
      placeholder: 'e.g., 100k, 1M, 2B'
    },
    endValue: {
      icon: 'tabler:calendar',
      label: 'End Value',
      placeholder: 'e.g., 150k, 1.5M'
    },
    years: {
      type: 'number',
      icon: 'tabler:hourglass',
      label: 'Years',
      min: 1,
      max: 20
    }
  })
  .result(
    z.object({
      cagr: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ startValue, endValue, years }, settings) => {
    const start = parseShorthand(startValue)

    const end = parseShorthand(endValue)

    if (isNaN(start) || isNaN(end) || start === 0 || years <= 0) {
      return { cagr: null, score: 0 }
    }

    const cagrValue = calculateCAGR(end, start, years)

    const scoreValue = getScore(cagrValue, settings.cagr)

    return { cagr: cagrValue, score: scoreValue }
  })
  .displayResult(
    ({ cagr, score }) =>
      cagr !== null && (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-bg-500 text-sm">Growth Rate</div>
            <div className="text-2xl font-semibold">{cagr.toFixed(2)}%</div>
          </div>
          <ScoreBadge maxScore={50} score={score} />
        </div>
      )
  )

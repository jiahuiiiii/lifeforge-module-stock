import z from 'zod'

import {
  calculateProfitMargin,
  getScore
} from '@/pages/Toolbox/utils/calcFuncs'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'
import parseShorthand from '../utils/parseShorthand'

export default createCalculator('tabler:chart-pie')
  .fields(
    z.object({
      netIncome: z.string(),
      revenue: z.string()
    })
  )
  .config({
    netIncome: {
      icon: 'tabler:wallet',
      label: 'Net Income',
      placeholder: 'e.g., 50M, -10M, 2B'
    },
    revenue: {
      icon: 'tabler:cash',
      label: 'Total Revenue',
      placeholder: 'e.g., 250M, 1B'
    }
  })
  .result(
    z.object({
      margin: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ netIncome, revenue }, settings) => {
    const income = parseShorthand(netIncome)

    const rev = parseShorthand(revenue)

    if (isNaN(income) || isNaN(rev) || rev <= 0) {
      return { margin: null, score: 0 }
    }

    const marginValue = calculateProfitMargin(income, rev)

    const scoreValue = getScore(marginValue, settings.margin)

    return { margin: marginValue, score: scoreValue }
  })
  .displayResult(
    ({ margin, score }) =>
      margin !== null && (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-bg-500 text-sm">Profit Margin</div>
            <div className="text-2xl font-semibold">{margin.toFixed(2)}%</div>
          </div>
          <ScoreBadge maxScore={20} score={score} />
        </div>
      )
  )

import z from 'zod'

import { calculateROE, getScore } from '@/pages/Toolbox/utils/calcFuncs'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'
import parseShorthand from '../utils/parseShorthand'

export default createCalculator('tabler:activity')
  .fields(
    z.object({
      netIncome: z.string(),
      equity: z.string()
    })
  )
  .config({
    netIncome: {
      icon: 'tabler:wallet',
      label: 'Net Income',
      placeholder: 'e.g., 50M, -10M, 2B'
    },
    equity: {
      icon: 'tabler:building-bank',
      label: 'Equity',
      placeholder: 'e.g., 300M, 1.5B'
    }
  })
  .result(
    z.object({
      roe: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ netIncome, equity }, settings) => {
    const income = parseShorthand(netIncome)

    const eq = parseShorthand(equity)

    if (isNaN(income) || isNaN(eq) || eq <= 0) {
      return { roe: null, score: 0 }
    }

    const roeValue = calculateROE(income, eq)

    const scoreValue = getScore(roeValue, settings.roe)

    return { roe: roeValue, score: scoreValue }
  })
  .displayResult(
    ({ roe, score }) =>
      roe !== null && (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-bg-500 text-sm">Return on Equity</div>
            <div className="text-2xl font-semibold">{roe.toFixed(2)}%</div>
          </div>
          <ScoreBadge maxScore={20} score={score} />
        </div>
      )
  )

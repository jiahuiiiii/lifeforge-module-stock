import { Icon } from '@iconify/react'
import z from 'zod'

import { calculatePEDiscount } from '@/pages/Analyzer/calculators'

import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:history')
  .fields(
    z.object({
      currentPE: z.number(),
      avgPE: z.number()
    })
  )
  .config({
    currentPE: {
      type: 'number',
      icon: 'tabler:percentage',
      label: 'Current PE',
      placeholder: 'e.g., 12'
    },
    avgPE: {
      type: 'number',
      icon: 'tabler:chart-line',
      label: 'Avg PE',
      placeholder: 'e.g., 20'
    }
  })
  .result(
    z.object({
      discount: z.number().nullable(),
      isUndervalued: z.boolean()
    })
  )
  .calculate(({ currentPE, avgPE }) => {
    if (currentPE <= 0 || avgPE <= 0) {
      return { discount: null, isUndervalued: false }
    }

    const discountValue = calculatePEDiscount(currentPE, avgPE)

    return { discount: discountValue, isUndervalued: discountValue >= 25 }
  })
  .displayResult(
    ({ discount, isUndervalued }) =>
      discount !== null && (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-bg-500 text-sm">PE Discount</div>
            <div className="text-2xl font-semibold">
              {discount > 0 ? '+' : ''}
              {discount.toFixed(1)}%
            </div>
          </div>
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${
              isUndervalued
                ? 'border-green-500/50 bg-green-500/20 text-green-500'
                : 'border-yellow-500/50 bg-yellow-500/20 text-yellow-500'
            }`}
          >
            <Icon
              icon={isUndervalued ? 'tabler:check' : 'tabler:alert-circle'}
            />
            {isUndervalued ? 'Undervalued (Buy Signal)' : 'No safety margin'}
          </div>
        </div>
      )
  )

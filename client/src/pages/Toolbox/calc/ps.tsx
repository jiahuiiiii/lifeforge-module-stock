import { Icon } from '@iconify/react'
import z from 'zod'

import { calculatePSRatio } from '@/pages/Analyzer/calculators'

import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:receipt')
  .fields(
    z.object({
      marketCap: z.number(),
      totalSales: z.number()
    })
  )
  .config({
    marketCap: {
      type: 'currency',
      icon: 'tabler:chart-pie',
      label: 'Market Cap',
      placeholder: 'e.g., 1000000'
    },
    totalSales: {
      type: 'currency',
      icon: 'tabler:receipt',
      label: 'Total Sales',
      placeholder: 'e.g., 500000'
    }
  })
  .result(
    z.object({
      psRatio: z.number().nullable()
    })
  )
  .calculate(({ marketCap, totalSales }) => {
    if (marketCap <= 0 || totalSales <= 0) {
      return { psRatio: null }
    }

    return { psRatio: calculatePSRatio(marketCap, totalSales) }
  })
  .displayResult(
    ({ psRatio }) =>
      psRatio !== null &&
      isFinite(psRatio) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-bg-500 text-sm">P/S Ratio</div>
              <div className="text-2xl font-semibold">
                {psRatio.toFixed(2)}x
              </div>
            </div>
          </div>
          <div className="text-bg-500 flex items-start gap-2 text-sm">
            <Icon
              className="mt-0.5 size-4 shrink-0"
              icon="tabler:info-circle"
            />
            <span>
              P/S ratio alone is not sufficient. Must combine with Profit Margin
              check for meaningful analysis.
            </span>
          </div>
        </div>
      )
  )

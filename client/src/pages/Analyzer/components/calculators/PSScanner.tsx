import { Icon } from '@iconify/react'
import { useMemo, useState } from 'react'

import { calculatePSRatio } from '../../calculators'
import CalculatorCard from '../CalculatorCard'

export default function PSScanner() {
  const [marketCap, setMarketCap] = useState<string>('')

  const [totalSales, setTotalSales] = useState<string>('')

  const psRatio = useMemo(() => {
    const cap = parseFloat(marketCap)

    const sales = parseFloat(totalSales)

    if (isNaN(cap) || isNaN(sales) || cap <= 0 || sales <= 0) {
      return null
    }

    return calculatePSRatio(cap, sales)
  }, [marketCap, totalSales])

  return (
    <CalculatorCard
      description="Calculate price-to-sales ratio"
      icon="tabler:receipt"
      result={
        psRatio !== null && isFinite(psRatio) ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-bg-500 text-sm">P/S Ratio</div>
                <div className="text-2xl font-bold">{psRatio.toFixed(2)}x</div>
              </div>
            </div>
            <div className="text-bg-500 flex items-start gap-2 text-sm">
              <Icon
                className="mt-0.5 size-4 shrink-0"
                icon="tabler:info-circle"
              />
              <span>
                P/S ratio alone is not sufficient. Must combine with Profit
                Margin check for meaningful analysis.
              </span>
            </div>
          </div>
        ) : (
          <div className="text-bg-500 text-center text-sm">
            Enter values to calculate
          </div>
        )
      }
      title="Price-to-Sales Scanner"
    >
      <div>
        <label className="text-bg-500 mb-1 block text-sm">
          Market Cap (or Price)
        </label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 1000000"
          type="number"
          value={marketCap}
          onChange={e => setMarketCap(e.target.value)}
        />
      </div>
      <div>
        <label className="text-bg-500 mb-1 block text-sm">
          Total Sales (or Sales/Share)
        </label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 500000"
          type="number"
          value={totalSales}
          onChange={e => setTotalSales(e.target.value)}
        />
      </div>
    </CalculatorCard>
  )
}

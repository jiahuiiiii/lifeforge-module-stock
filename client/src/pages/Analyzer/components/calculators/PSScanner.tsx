import { Icon } from '@iconify/react'
import { CurrencyInput } from 'lifeforge-ui'
import { useMemo, useState } from 'react'

import { calculatePSRatio } from '../../calculators'
import CalculatorCard from '../CalculatorCard'

export default function PSScanner() {
  const [marketCap, setMarketCap] = useState(0)

  const [totalSales, setTotalSales] = useState(0)

  const psRatio = useMemo(() => {
    if (marketCap <= 0 || totalSales <= 0) {
      return null
    }

    return calculatePSRatio(marketCap, totalSales)
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
      <CurrencyInput
        icon="tabler:chart-pie"
        label="Market Cap (or Price)"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 1000000"
        value={marketCap}
        onChange={setMarketCap}
      />
      <CurrencyInput
        icon="tabler:receipt"
        label="Total Sales (or Sales/Share)"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 500000"
        value={totalSales}
        onChange={setTotalSales}
      />
    </CalculatorCard>
  )
}

import { Icon } from '@iconify/react'
import { useMemo, useState } from 'react'

import { calculatePEDiscount } from '../../calculators'
import CalculatorCard from '../CalculatorCard'

export default function HistoricalPEDiscount() {
  const [currentPE, setCurrentPE] = useState<string>('')

  const [avgPE, setAvgPE] = useState<string>('')

  const { discount, isUndervalued } = useMemo(() => {
    const current = parseFloat(currentPE)

    const avg = parseFloat(avgPE)

    if (isNaN(current) || isNaN(avg) || current <= 0 || avg <= 0) {
      return { discount: null, isUndervalued: false }
    }

    const discountValue = calculatePEDiscount(current, avg)

    return { discount: discountValue, isUndervalued: discountValue >= 25 }
  }, [currentPE, avgPE])

  return (
    <CalculatorCard
      description="Compare current PE to historical average for safety margin"
      icon="tabler:history"
      result={
        discount !== null ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-bg-500 text-sm">PE Discount</div>
              <div className="text-2xl font-bold">
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
        ) : (
          <div className="text-bg-500 text-center text-sm">
            Enter values to check
          </div>
        )
      }
      title="Historical PE Discount"
    >
      <div>
        <label className="text-bg-500 mb-1 block text-sm">Current PE</label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 12"
          type="number"
          value={currentPE}
          onChange={e => setCurrentPE(e.target.value)}
        />
      </div>
      <div>
        <label className="text-bg-500 mb-1 block text-sm">
          10-Year Average PE
        </label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 20"
          type="number"
          value={avgPE}
          onChange={e => setAvgPE(e.target.value)}
        />
      </div>
    </CalculatorCard>
  )
}

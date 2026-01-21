import { Icon } from '@iconify/react'
import { NumberInput } from 'lifeforge-ui'
import { useMemo, useState } from 'react'

import { calculatePEDiscount } from '../../calculators'
import CalculatorCard from '../CalculatorCard'

export default function HistoricalPEDiscount() {
  const [currentPE, setCurrentPE] = useState(0)

  const [avgPE, setAvgPE] = useState(0)

  const { discount, isUndervalued } = useMemo(() => {
    if (currentPE <= 0 || avgPE <= 0) {
      return { discount: null, isUndervalued: false }
    }

    const discountValue = calculatePEDiscount(currentPE, avgPE)

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
        ) : (
          <div className="text-bg-500 text-center text-sm">
            Enter values to check
          </div>
        )
      }
      title="Historical PE Discount"
    >
      <NumberInput
        icon="tabler:percentage"
        label="Current PE"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 12"
        value={currentPE}
        onChange={setCurrentPE}
      />
      <NumberInput
        icon="tabler:chart-line"
        label="10-Year Average PE"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 20"
        value={avgPE}
        onChange={setAvgPE}
      />
    </CalculatorCard>
  )
}

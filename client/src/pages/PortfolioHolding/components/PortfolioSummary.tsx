import { Widget } from 'lifeforge-ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { HoldingWithPrice } from './HoldingsTable'

export default function PortfolioSummary({
  holdingsWithPrices
}: {
  holdingsWithPrices: HoldingWithPrice[]
}) {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const {
    totalValue,
    totalCost,
    dayChange,
    dayChangePercent,
    totalPL,
    totalPLPercent,
    isPositive,
    isDayPositive
  } = useMemo(() => {
    let totalValue = 0
    let totalCost = 0
    let dayChange = 0

    for (const holding of holdingsWithPrices) {
      totalValue += holding.shares * holding.currentPrice
      totalCost += holding.shares * holding.avgCost
      dayChange += holding.shares * holding.change
    }

    const dayChangePercent =
      totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0

    const totalPL = totalValue - totalCost

    const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0

    const isPositive = totalPL >= 0

    const isDayPositive = dayChange >= 0

    return {
      totalValue,
      totalCost,
      dayChange,
      dayChangePercent,
      totalPL,
      totalPLPercent,
      isPositive,
      isDayPositive
    }
  }, [holdingsWithPrices])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Widget
        className="flex flex-col"
        icon="tabler:currency-dollar"
        namespace={false}
        title={t('widgets.totalValue')}
        variant="large-icon"
      >
        <div className="text-3xl font-semibold">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </Widget>

      <Widget
        className="flex flex-col"
        icon="tabler:currency-dollar"
        namespace={false}
        title={t('widgets.totalCost')}
        variant="large-icon"
      >
        <div className="text-3xl font-semibold">
          ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </Widget>

      <Widget
        className="flex flex-col"
        icon={isPositive ? 'tabler:trending-up' : 'tabler:trending-down'}
        namespace={false}
        title={t('widgets.totalPL')}
        variant="large-icon"
      >
        <div
          className={`flex items-center gap-2 text-3xl font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}
        >
          <span>
            {isPositive ? '+' : ''}$
            {Math.abs(totalPL).toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}
          </span>
          <span className="text-sm">
            ({isPositive ? '+' : ''}
            {totalPLPercent.toFixed(2)}%)
          </span>
        </div>
      </Widget>

      <Widget
        className="flex flex-col"
        icon={isDayPositive ? 'tabler:arrow-up' : 'tabler:arrow-down'}
        namespace={false}
        title={t('widgets.dayChange')}
        variant="large-icon"
      >
        <div
          className={`flex items-center gap-2 text-3xl font-semibold ${isDayPositive ? 'text-green-500' : 'text-red-500'}`}
        >
          <span>
            {isDayPositive ? '+' : ''}$
            {Math.abs(dayChange).toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}
          </span>
          <span className="text-sm">
            ({isDayPositive ? '+' : ''}
            {dayChangePercent.toFixed(2)}%)
          </span>
        </div>
      </Widget>
    </div>
  )
}

import { Icon } from '@iconify/react'
import { Card } from 'lifeforge-ui'

interface PortfolioSummaryProps {
  totalValue: number
  totalCost: number
  dayChange: number
  dayChangePercent: number
}

export default function PortfolioSummary({
  totalValue,
  totalCost,
  dayChange,
  dayChangePercent
}: PortfolioSummaryProps) {
  const totalPL = totalValue - totalCost
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0
  const isPositive = totalPL >= 0
  const isDayPositive = dayChange >= 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="flex flex-col">
        <div className="text-bg-500 mb-1 text-sm">Total Value</div>
        <div className="text-2xl font-bold">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </Card>

      <Card className="flex flex-col">
        <div className="text-bg-500 mb-1 text-sm">Total Cost</div>
        <div className="text-2xl font-bold">
          ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </Card>

      <Card className="flex flex-col">
        <div className="text-bg-500 mb-1 text-sm">Total P/L</div>
        <div
          className={`flex items-center gap-2 text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}
        >
          <Icon
            icon={isPositive ? 'tabler:trending-up' : 'tabler:trending-down'}
          />
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
      </Card>

      <Card className="flex flex-col">
        <div className="text-bg-500 mb-1 text-sm">Day Change</div>
        <div
          className={`flex items-center gap-2 text-2xl font-bold ${isDayPositive ? 'text-green-500' : 'text-red-500'}`}
        >
          <Icon
            icon={isDayPositive ? 'tabler:arrow-up' : 'tabler:arrow-down'}
          />
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
      </Card>
    </div>
  )
}

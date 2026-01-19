import { Button, Card, ConfirmationModal, useModalStore } from 'lifeforge-ui'

import type { PortfolioHolding } from '../store'

interface HoldingWithPrice extends PortfolioHolding {
  currentPrice: number
  change: number
  changePercent: number
}

interface HoldingsTableProps {
  holdings: HoldingWithPrice[]
  onRemove: (id: string) => void
  onEdit: (holding: HoldingWithPrice) => void
  isLoading: boolean
}

export default function HoldingsTable({
  holdings,
  onRemove,
  onEdit,
  isLoading
}: HoldingsTableProps) {
  const { open } = useModalStore()

  if (holdings.length === 0) {
    return null
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-bg-200 bg-bg-100 dark:border-bg-700 dark:bg-bg-800 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold">Symbol</th>
              <th className="px-4 py-3 font-semibold">Added On</th>
              <th className="px-4 py-3 text-right font-semibold">Shares</th>
              <th className="px-4 py-3 text-right font-semibold">Avg Cost</th>
              <th className="px-4 py-3 text-right font-semibold">
                Current Price
              </th>
              <th className="px-4 py-3 text-right font-semibold">
                Market Value
              </th>
              <th className="px-4 py-3 text-right font-semibold">P/L</th>
              <th className="px-4 py-3 text-right font-semibold">P/L %</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(holding => {
              const marketValue = holding.shares * holding.currentPrice

              const costBasis = holding.shares * holding.avgCost

              const pl = marketValue - costBasis

              const plPercent = costBasis > 0 ? (pl / costBasis) * 100 : 0

              const isPositive = pl >= 0

              return (
                <tr
                  key={holding.id}
                  className="border-bg-200 dark:border-bg-700 border-b last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold">{holding.symbol}</div>
                    <div className="text-bg-500 text-xs">{holding.name}</div>
                  </td>
                  <td className="text-bg-500 px-4 py-3 text-sm">
                    {new Date(holding.dateAdded).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {holding.shares.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${holding.avgCost.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isLoading ? (
                      <span className="text-bg-400">Loading...</span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <div className="font-medium">
                          ${holding.currentPrice.toFixed(2)}
                        </div>
                        <div
                          className={`text-xs ${holding.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {holding.change >= 0 ? '+' : ''}
                          {holding.change.toFixed(2)} (
                          {holding.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    $
                    {marketValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2
                    })}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {isPositive ? '+' : ''}${pl.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {isPositive ? '+' : ''}
                    {plPercent.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <Button
                        icon="tabler:edit"
                        variant="plain"
                        onClick={() => onEdit(holding)}
                      />
                      <Button
                        dangerous
                        icon="tabler:trash"
                        variant="plain"
                        onClick={() =>
                          open(ConfirmationModal, {
                            title: 'Remove Holding',
                            description: `Remove ${holding.symbol} from portfolio? This action cannot be undone.`,
                            confirmationButton: 'confirm',
                            onConfirm: async () => {
                              onRemove(holding.id)
                            }
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

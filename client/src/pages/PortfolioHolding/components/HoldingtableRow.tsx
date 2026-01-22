import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, ConfirmationModal, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import forgeAPI from '@/utils/forgeAPI'

import type { HoldingWithPrice } from './HoldingsTable'
import ModifyHoldingModal from './ModifyHoldingModal'

function HoldingtableRow({
  holding,
  isLoading
}: {
  holding: HoldingWithPrice
  isLoading: boolean
}) {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const { open } = useModalStore()

  const queryClient = useQueryClient()

  const removeHoldingMutation = useMutation(
    forgeAPI.portfolios.holdings.remove
      .input({
        id: holding.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['jiahuiiiii--stock', 'portfolios']
          })
        }
      })
  )

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
        <div className="text-bg-500 text-sm">{holding.name}</div>
      </td>
      <td className="text-bg-500 px-4 py-3">
        {new Date(holding.dateAdded).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right font-medium">
        {holding.shares.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right">${holding.avgCost.toFixed(2)}</td>
      <td className="px-4 py-3 text-right">
        {isLoading ? (
          <span className="text-bg-400">{t('common.loading')}</span>
        ) : (
          <div className="flex flex-col items-end">
            <div className="font-medium">
              ${holding.currentPrice.toFixed(2)}
            </div>
            <div
              className={`text-xs ${holding.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {holding.change >= 0 ? '+' : ''}
              {holding.change.toFixed(2)} ({holding.changePercent.toFixed(2)}%)
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
            icon="tabler:pencil"
            variant="plain"
            onClick={() =>
              open(ModifyHoldingModal, {
                initialData: holding,
                openType: 'update'
              })
            }
          />
          <Button
            dangerous
            icon="tabler:trash"
            variant="plain"
            onClick={() =>
              open(ConfirmationModal, {
                title: t('modals.holding.remove'),
                description: t('modals.holding.removeConfirmation', {
                  symbol: holding.symbol
                }),
                confirmationButton: 'confirm',
                onConfirm: async () => {
                  await removeHoldingMutation.mutateAsync({})
                }
              })
            }
          />
        </div>
      </td>
    </tr>
  )
}

export default HoldingtableRow

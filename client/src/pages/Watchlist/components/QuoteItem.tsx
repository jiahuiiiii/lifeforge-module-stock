import { Icon } from '@iconify/react'
import { Button, Card, ConfirmationModal, LoadingScreen } from 'lifeforge-ui'
import { Link, useModalStore } from 'shared'

import type { WatchlistItem } from '@/pages/Dashboard'

import type { Quote } from '..'

function QuoteItem({
  item,
  quote,
  removeFromWatchlist
}: {
  item: WatchlistItem
  quote: Quote | 'error'
  removeFromWatchlist: (symbol: string) => void
}) {
  const { open } = useModalStore()

  const isPositive = quote === 'error' ? false : quote?.change >= 0

  const isLoading = quote === undefined

  return (
    <Card
      key={item.symbol}
      className={`relative flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg ${
        isLoading
          ? ''
          : isPositive
            ? 'border-l-4 border-l-green-500'
            : 'border-l-4 border-l-red-500'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            className="hover:text-custom-500 text-xl font-semibold tracking-tight transition-colors"
            to="/"
          >
            {item.symbol}
          </Link>
          <p className="text-bg-500 mt-0.5 truncate text-sm">{item.name}</p>
        </div>
        <Button
          className="text-bg-400 -mt-1 -mr-2 shrink-0 p-2! hover:text-red-500"
          icon="tabler:x"
          type="button"
          variant="plain"
          onClick={() =>
            open(ConfirmationModal, {
              title: 'Remove from Watchlist',
              description:
                'Are you sure you want to remove this stock from your watchlist?',
              onConfirm: async () => removeFromWatchlist(item.symbol)
            })
          }
        />
      </div>

      {quote === 'error' ? (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
          <Icon className="size-4" icon="tabler:alert-circle" />
          Unable to fetch data
        </div>
      ) : quote ? (
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-semibold tracking-tight">
              ${quote.price.toFixed(2)}
            </div>
          </div>

          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold ${
              isPositive
                ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                : 'bg-red-500/15 text-red-600 dark:text-red-400'
            }`}
          >
            <Icon
              className="size-4"
              icon={isPositive ? 'tabler:trending-up' : 'tabler:trending-down'}
            />
            <span>
              {isPositive ? '+' : ''}
              {quote.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-center py-4">
          <LoadingScreen loaderSize="1.5rem" />
        </div>
      )}

      {quote && quote !== 'error' && (
        <div
          className={`mt-3 border-t pt-3 text-sm ${
            isPositive
              ? 'border-green-500/20 text-green-600 dark:text-green-400'
              : 'border-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {isPositive ? '+' : ''}${quote.change.toFixed(2)} today
        </div>
      )}
    </Card>
  )
}

export default QuoteItem

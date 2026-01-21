import { useQueries } from '@tanstack/react-query'
import { EmptyStateScreen, ModuleHeader } from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'

import forgeAPI from '@/utils/forgeAPI'

import type { WatchlistItem } from '../Dashboard'
import QuoteItem from './components/QuoteItem'

export interface Quote {
  symbol: string
  price: number
  change: number
  changePercent: number
}

function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

  // Load watchlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('stock_watchlist')

    if (stored) {
      try {
        setWatchlist(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse watchlist', e)
      }
    }
  }, [])

  const quoteQueries = useQueries({
    queries: watchlist.map(item =>
      forgeAPI.data.getQuote.input({ symbol: item.symbol }).queryOptions({
        refetchInterval: 30000,
        enabled: !!item.symbol,
        retry: 0
      })
    )
  })

  const quotes = useMemo(() => {
    const quotes: Record<string, Quote | 'error'> = {}

    watchlist.forEach((item, index) => {
      const query = quoteQueries[index]

      if (query.isError) {
        console.error('Failed to fetch quote', query.error)
        quotes[item.symbol] = 'error'
      }

      if (query.data) {
        quotes[item.symbol] = query.data
      }
    })

    return quotes
  }, [quoteQueries, watchlist])

  const removeFromWatchlist = (symbol: string) => {
    const updated = watchlist.filter(item => item.symbol !== symbol)

    setWatchlist(updated)
    localStorage.setItem('stock_watchlist', JSON.stringify(updated))
  }

  return (
    <>
      <ModuleHeader
        icon="tabler:eye"
        namespace="apps.jiahuiiiii$stock"
        title="watchlist"
        tKey="subsectionsTitleAndDesc"
      />
      {watchlist.length === 0 ? (
        <div className="flex-1">
          <EmptyStateScreen
            icon="tabler:eye-off"
            message={{
              id: 'watchlist',
              namespace: 'apps.jiahuiiiii$stock'
            }}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {watchlist.map(item => (
            <QuoteItem
              key={item.symbol}
              item={item}
              quote={quotes[item.symbol]}
              removeFromWatchlist={removeFromWatchlist}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Watchlist

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
      forgeAPI.getQuote.input({ symbol: item.symbol }).queryOptions({
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

  if (watchlist.length === 0) {
    return (
      <div className="animate-[fadeSlideIn_0.3s_ease-out]">
        <ModuleHeader />
        <EmptyStateScreen
          icon="tabler:eye-off"
          message={{
            id: 'watchlist',
            namespace: 'apps.jiahuiiiii$stock'
          }}
        />
      </div>
    )
  }

  return (
    <div className="animate-[fadeSlideIn_0.3s_ease-out]">
      <ModuleHeader title="Watchlist" />

      {/* Header section */}
      <div className="mb-6">
        <p className="text-bg-500">
          Track your favorite stocks in real-time. Prices update every 30
          seconds.
        </p>
      </div>

      {/* Watchlist grid */}
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
    </div>
  )
}

export default Watchlist

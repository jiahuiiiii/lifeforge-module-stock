import { useQueries } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import type { InferOutput } from '@lifeforge/api'
import {
  EmptyStateScreen,
  Flex,
  Grid,
  ModuleHeader,
  Stack
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { WatchlistItem } from '../Dashboard'
import QuoteItem from './components/QuoteItem'

export type Quote = InferOutput<typeof forgeAPI.data.getQuote>

function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('stock_watchlist')

    if (!stored) return

    try {
      setWatchlist(JSON.parse(stored))
    } catch {
      setWatchlist([])
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
    const nextQuotes: Record<string, Quote | 'error'> = {}

    watchlist.forEach((item, index) => {
      const query = quoteQueries[index]

      if (!query) return

      if (query.isError) {
        nextQuotes[item.symbol] = 'error'
      }

      if (query.data) {
        nextQuotes[item.symbol] = query.data
      }
    })

    return nextQuotes
  }, [quoteQueries, watchlist])

  function removeFromWatchlist(symbol: string) {
    const updated = watchlist.filter(item => item.symbol !== symbol)

    setWatchlist(updated)
    localStorage.setItem('stock_watchlist', JSON.stringify(updated))
  }

  return (
    <>
      <ModuleHeader icon="tabler:eye" title="watchlist" />
      {watchlist.length === 0 ? (
        <Flex flex="1">
          <EmptyStateScreen icon="tabler:eye-off" message={{ id: 'watchlist' }} />
        </Flex>
      ) : (
        <Stack gap="md">
          <Grid gap="md" templateCols={{ base: 1, sm: 2, lg: 3, xl: 4 }}>
            {watchlist.map(item => (
              <QuoteItem
                key={item.symbol}
                item={item}
                quote={quotes[item.symbol]}
                removeFromWatchlist={symbol => {
                  removeFromWatchlist(symbol)
                }}
              />
            ))}
          </Grid>
        </Stack>
      )}
    </>
  )
}

export default Watchlist

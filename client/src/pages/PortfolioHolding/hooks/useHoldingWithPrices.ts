import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'

import { forgeAPI } from '@/manifest'

import type { HoldingEntry } from '..'

function useHoldingWithPrices(holdings: HoldingEntry[]) {
  const quoteQueries = useQueries({
    queries: holdings.map(holding =>
      forgeAPI.data.getQuote.input({ symbol: holding.symbol }).queryOptions({
        refetchInterval: 60000,
        enabled: !!holding.symbol,
        retry: 0
      })
    )
  })

  const holdingsWithPrices = useMemo(
    () =>
      holdings.map((holding, index) => {
        const quote = quoteQueries[index]?.data

        return {
          ...holding,
          currentPrice: quote?.price ?? holding.avg_cost,
          change: quote?.change ?? 0,
          changePercent: quote?.change_percent ?? 0
        }
      }),
    [holdings, quoteQueries]
  )

  return {
    holdingsWithPrices,
    isLoading: quoteQueries.some(query => query.isLoading)
  }
}

export default useHoldingWithPrices

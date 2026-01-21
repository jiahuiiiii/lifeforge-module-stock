import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'

import forgeAPI from '@/utils/forgeAPI'

import type { HoldingEntry } from '..'

function useHoldingWithPrices(holdings: HoldingEntry[]) {
  // Fetch quotes for all holdings
  const quoteQueries = useQueries({
    queries: holdings.map(holding =>
      forgeAPI.data.getQuote.input({ symbol: holding.symbol }).queryOptions({
        refetchInterval: 60000,
        enabled: !!holding.symbol,
        retry: 0
      })
    )
  })

  // Merge holdings with price data
  const holdingsWithPrices = useMemo(() => {
    return holdings.map((holding, index) => {
      const query = quoteQueries[index]

      const quote = query?.data

      return {
        ...holding,
        currentPrice: quote?.price ?? holding.avgCost,
        change: quote?.change ?? 0,
        changePercent: quote?.changePercent ?? 0
      }
    })
  }, [holdings, quoteQueries])

  return {
    holdingsWithPrices,
    isLoading: quoteQueries.some(query => query.isLoading)
  }
}

export default useHoldingWithPrices

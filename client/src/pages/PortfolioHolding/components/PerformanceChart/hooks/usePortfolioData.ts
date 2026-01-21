import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'

import forgeAPI from '@/utils/forgeAPI'

import type { HoldingEntry } from '../../..'

function usePortfolioData(
  holdings: HoldingEntry[],
  rangeStartDate: string | null
) {
  // Fetch historical data for each holding (for chart)
  const holdingHistoryQueries = useQueries({
    queries: holdings.map(holding =>
      forgeAPI.data.getStock.input({ symbol: holding.symbol }).queryOptions({
        enabled: !!holding.symbol,
        staleTime: 300000
      })
    )
  })

  // Prepare portfolio data for chart (compute from historical stock prices)
  const portfolioData = useMemo(() => {
    // Check if all history queries are loaded
    const allLoaded = holdingHistoryQueries.every(q => q.data)

    if (!allLoaded || holdings.length === 0) return []

    // Build a map of date -> { symbol -> close price }
    const priceMap = new Map<string, Map<string, number>>()

    holdings.forEach((holding, index) => {
      const historyData = holdingHistoryQueries[index]?.data?.data ?? []

      for (const item of historyData) {
        if (!priceMap.has(item.date)) {
          priceMap.set(item.date, new Map())
        }
        priceMap.get(item.date)!.set(holding.symbol, item.close)
      }
    })

    // Get all dates and sort chronologically
    const allDates = Array.from(priceMap.keys()).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )

    // Calculate portfolio value for each date
    const result: Array<{ date: string; value: number }> = []

    for (const date of allDates) {
      // Filter by range
      if (rangeStartDate && date < rangeStartDate) continue

      let totalValue = 0

      const prices = priceMap.get(date)!

      for (const holding of holdings) {
        // Only count this holding if it was added on or before this date
        const holdingDate = holding.dateAdded.split('T')[0]

        if (holdingDate <= date) {
          const price = prices.get(holding.symbol)

          if (price !== undefined) {
            totalValue += holding.shares * price
          }
        }
      }

      if (totalValue > 0) {
        result.push({ date, value: totalValue })
      }
    }

    return result
  }, [holdings, holdingHistoryQueries, rangeStartDate])

  return {
    portfolioData,
    isLoading: holdingHistoryQueries.every(q => q.isLoading),
    error: holdingHistoryQueries.map(q => q.error).filter(Boolean)[0]
  }
}

export default usePortfolioData

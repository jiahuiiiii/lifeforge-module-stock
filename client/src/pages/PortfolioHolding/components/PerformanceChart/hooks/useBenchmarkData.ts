import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import forgeAPI from '@/utils/forgeAPI'

import type { HoldingEntry } from '../../..'

function useBenchmarkData(
  holdings: HoldingEntry[],
  selectedBenchmark: string,
  rangeStartDate: string | null
) {
  const benchmarkQuery = useQuery(
    forgeAPI.data.getStock.input({ symbol: selectedBenchmark }).queryOptions({
      enabled: holdings.length > 0,
      staleTime: 300000
    })
  )

  const benchmarkData = useMemo(() => {
    const data = benchmarkQuery.data?.data ?? []

    // Reverse to chronological order (API usually returns newest first)
    const sortedData = [...data].reverse()

    // Filter by date range
    return sortedData
      .filter((item: { date: string; close: number }) => {
        if (!rangeStartDate) return true

        return item.date >= rangeStartDate
      })
      .map((item: { date: string; close: number }) => ({
        date: item.date,
        value: item.close
      }))
  }, [benchmarkQuery.data, rangeStartDate])

  return {
    benchmarkData,
    isLoading: benchmarkQuery.isLoading,
    error: benchmarkQuery.error
  }
}

export default useBenchmarkData

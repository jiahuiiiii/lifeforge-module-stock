import { useMemo } from 'react'

import type { HoldingEntry } from '../../..'
import useBenchmarkData from './useBenchmarkData'
import usePortfolioData from './usePortfolioData'
import useRangeStartDate from './useRangeStartDate'

function useFinalChartData(
  holdings: HoldingEntry[],
  selectedBenchmark: string,
  timeRange: string
) {
  const rangeStartDate = useRangeStartDate(timeRange)

  const {
    portfolioData,
    isLoading: isPortfolioLoading,
    error: portfolioError
  } = usePortfolioData(holdings, rangeStartDate)

  const {
    benchmarkData,
    isLoading: isBenchmarkLoading,
    error: benchmarkError
  } = useBenchmarkData(holdings, selectedBenchmark, rangeStartDate)

  const chartData = useMemo(() => {
    if (portfolioData.length === 0) return []

    const portfolioStart = portfolioData[0]?.value || 0

    const benchmarkStart = benchmarkData[0]?.value || 0

    const dateMap = new Map<
      string,
      { portfolio?: number; benchmark?: number }
    >()

    // Add portfolio data
    for (const item of portfolioData) {
      const pctChange =
        portfolioStart > 0
          ? ((item.value - portfolioStart) / portfolioStart) * 100
          : 0

      dateMap.set(item.date, { portfolio: pctChange })
    }

    // Add benchmark data
    for (const item of benchmarkData) {
      const pctChange =
        benchmarkStart > 0
          ? ((item.value - benchmarkStart) / benchmarkStart) * 100
          : 0

      const existing = dateMap.get(item.date) || {}

      dateMap.set(item.date, { ...existing, benchmark: pctChange })
    }

    // Convert to array and sort by date
    return Array.from(dateMap.entries())
      .map(([date, values]) => ({
        date,
        portfolio: values.portfolio ?? null,
        benchmark: values.benchmark ?? null
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [portfolioData, benchmarkData])

  return {
    chartData,
    isLoading: isPortfolioLoading || isBenchmarkLoading,
    error: portfolioError || benchmarkError
  }
}

export default useFinalChartData

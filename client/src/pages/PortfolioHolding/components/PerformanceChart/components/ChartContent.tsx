import { LoadingScreen } from 'lifeforge-ui'

import type { HoldingEntry } from '@/pages/PortfolioHolding'
import useFinalChartData from '@/pages/PortfolioHolding/components/PerformanceChart/hooks/useFinalChartData'

import { BENCHMARKS } from '../constants/constants'
import ChartItself from './ChartItself'

function ChartContent({
  holdings,
  selectedBenchmark,
  portfolioName,
  timeRange
}: {
  holdings: HoldingEntry[]
  selectedBenchmark: string
  portfolioName: string
  timeRange: string
}) {
  const benchmarkSymbol =
    BENCHMARKS.find(b => b.symbol === selectedBenchmark)?.name ??
    selectedBenchmark

  const { chartData, isLoading, error } = useFinalChartData(
    holdings,
    selectedBenchmark,
    timeRange
  )

  if (error) {
    const isPlanLimit = error.message.includes('API_PLAN_LIMIT')

    return (
      <div className="flex-center h-64 flex-col gap-2 text-center">
        <div className="font-medium text-red-500">
          {isPlanLimit
            ? `Benchmark unavailable: ${benchmarkSymbol}`
            : 'Failed to load benchmark data'}
        </div>
        <div className="text-bg-500 max-w-sm text-sm">
          {isPlanLimit
            ? 'This index is not available on your current API plan. Please upgrade to view comparison data.'
            : error.message}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-center h-64">
        <LoadingScreen message="Loading performance data..." />
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="flex-center h-64">
        <div className="text-bg-500">No performance data available</div>
      </div>
    )
  }

  return (
    <ChartItself
      benchmarkSymbol={benchmarkSymbol}
      chartData={chartData}
      portfolioName={portfolioName}
      timeRange={timeRange}
    />
  )
}

export default ChartContent

import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, LoadingScreen, Text } from '@lifeforge/ui'

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
  const { t } = useModuleTranslation()

  const benchmarkSymbol =
    BENCHMARKS.find(benchmark => benchmark.symbol === selectedBenchmark)?.name ??
    selectedBenchmark

  const { chartData, isLoading, error } = useFinalChartData(
    holdings,
    selectedBenchmark,
    timeRange
  )

  if (error) {
    const isPlanLimit = error.message.includes('API_PLAN_LIMIT')

    return (
      <Flex align="center" direction="column" gap="sm" height="16em" justify="center">
        <Text color="red-500" weight="medium">
          {isPlanLimit
            ? t('performance.benchmarkUnavailable', {
                symbol: benchmarkSymbol
              })
            : t('performance.benchmarkLoadFailed')}
        </Text>
        <Text align="center" color="muted" size="sm">
          {isPlanLimit
            ? t('performance.planLimitDescription')
            : error.message}
        </Text>
      </Flex>
    )
  }

  if (isLoading) {
    return (
      <Flex align="center" height="16em" justify="center">
        <LoadingScreen message={t('performance.loading')} />
      </Flex>
    )
  }

  if (chartData.length === 0) {
    return (
      <Flex align="center" height="16em" justify="center">
        <Text color="muted">{t('performance.noData')}</Text>
      </Flex>
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

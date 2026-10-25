import { useState } from 'react'

import {
  Box,
  Flex,
  ListboxInput,
  ListboxOption,
  Text,
  Widget,
  createViewMode
} from '@lifeforge/ui'

import type { HoldingWithPrice } from '../HoldingsTable'
import ChartContent from './components/ChartContent'
import { BENCHMARKS, TIME_RANGES } from './constants/constants'

const TimeRangeViewMode = createViewMode({
  modes: TIME_RANGES.map(range => ({ value: range, text: range })),
  defaultValue: '1M',
  persistInLocalStorage: false,
  useNuqs: false,
  namespace: false
})

function PerformanceChart({
  portfolioName,
  holdings
}: {
  portfolioName: string
  holdings: HoldingWithPrice[]
}) {
  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY')
  const [timeRange, setTimeRange] = useState('1M')

  const selectedBenchmarkName =
    BENCHMARKS.find(benchmark => benchmark.symbol === selectedBenchmark)
      ?.name ?? selectedBenchmark

  return (
    <TimeRangeViewMode.Root currentMode={timeRange} onModeChange={setTimeRange}>
      <Widget
        actionComponent={
          <Flex align="center" gap="sm">
            <ListboxInput
              renderContent={value => (
                <Box asChild minWidth="min-content">
                  <Text size="base" weight="medium" whiteSpace="nowrap">
                    {value}
                  </Text>
                </Box>
              )}
              size="small"
              value={selectedBenchmarkName}
              variant="plain"
              onChange={value => {
                const benchmark = BENCHMARKS.find(item => item.name === value)

                setSelectedBenchmark(benchmark?.symbol ?? value)
              }}
            >
              {BENCHMARKS.map(benchmark => (
                <ListboxOption
                  key={benchmark.symbol}
                  label={benchmark.name}
                  value={benchmark.name}
                />
              ))}
            </ListboxInput>
            <TimeRangeViewMode.Selector size="small" />
          </Flex>
        }
        icon="tabler:chart-line"
        title="widgets.performanceVsLabel"
      >
        <ChartContent
          holdings={holdings}
          portfolioName={portfolioName}
          selectedBenchmark={selectedBenchmark}
          timeRange={timeRange}
        />
      </Widget>
    </TimeRangeViewMode.Root>
  )
}

export default PerformanceChart

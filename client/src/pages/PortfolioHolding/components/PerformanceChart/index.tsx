import {
  ListboxInput,
  ListboxOption,
  ViewModeSelector,
  Widget
} from 'lifeforge-ui'
import { useState } from 'react'
import { Trans } from 'react-i18next'

import type { HoldingWithPrice } from '../HoldingsTable'
import ChartContent from './components/ChartContent'
import { BENCHMARKS, TIME_RANGES } from './constants/constants'

export default function PerformanceChart({
  portfolioName,
  holdings
}: {
  portfolioName: string
  holdings: HoldingWithPrice[]
}) {
  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY')

  const [timeRange, setTimeRange] = useState('1M')

  return (
    <>
      <Widget
        actionComponent={
          <ViewModeSelector
            className="component-bg-lighter"
            currentMode={timeRange}
            options={TIME_RANGES.map(range => ({
              value: range,
              text: range
            }))}
            size="small"
            onModeChange={setTimeRange}
          />
        }
        className="h-min"
        icon="tabler:chart-line"
        namespace={false}
        title={
          <span className="flex items-center gap-2">
            <Trans
              components={{
                benchmark: (
                  <ListboxInput
                    buttonContent={
                      <div className="text-base! font-medium">
                        {
                          BENCHMARKS.find(b => b.symbol === selectedBenchmark)
                            ?.name
                        }
                      </div>
                    }
                    className="!min-w-40 flex-0!"
                    size="small"
                    value={selectedBenchmark}
                    variant="plain"
                    onChange={setSelectedBenchmark}
                  >
                    {BENCHMARKS.map(b => (
                      <ListboxOption
                        key={b.symbol}
                        label={b.name}
                        value={b.symbol}
                      />
                    ))}
                  </ListboxInput>
                )
              }}
              i18nKey="widgets.performanceVs"
              ns="apps.jiahuiiiii$stock"
            />
          </span>
        }
      >
        <ChartContent
          holdings={holdings}
          portfolioName={portfolioName}
          selectedBenchmark={selectedBenchmark}
          timeRange={timeRange}
        />
      </Widget>
    </>
  )
}

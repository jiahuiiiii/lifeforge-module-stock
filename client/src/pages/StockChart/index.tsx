import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import {
  Button,
  Flex,
  GoBackButton,
  Stack,
  Text,
  WithQuery,
  createViewMode
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import CandlestickChart from '@/pages/StockChart/components/CandlestickChart'

import type { WatchlistItem } from '../Dashboard'

const TIME_RANGES = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'] as const

type TimeRange = (typeof TIME_RANGES)[number]

const TimeRangeViewMode = createViewMode({
  modes: TIME_RANGES.map(range => ({ value: range, text: range })),
  defaultValue: '1M',
  persistInLocalStorage: false,
  useNuqs: false,
  namespace: false
})

function StockChart() {
  const navigate = useNavigate()
  const { symbolAndName } = useParams<{ symbolAndName: string }>()

  const [symbol, name] = symbolAndName?.split('||') ?? []

  const [timeRange, setTimeRange] = useState<TimeRange>('1M')
  const [watchlistVersion, setWatchlistVersion] = useState(0)

  const stockDataQuery = useQuery(
    forgeAPI.data.getStock.input({ symbol: symbol ?? '' }).queryOptions({
      enabled: !!symbol
    })
  )

  const isInWatchList = useMemo(() => {
    if (!symbol) return false

    return (
      (
        JSON.parse(localStorage.getItem('stock_watchlist') ?? '[]') as {
          symbol: string
        }[]
      ).some(item => item.symbol === symbol) && watchlistVersion >= 0
    )
  }, [symbol, watchlistVersion])

  const filteredData = useMemo(() => {
    if (!stockDataQuery.data?.data) return []

    const daysMap: Record<TimeRange, number> = {
      '1D': 1,
      '5D': 5,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '5Y': 1825
    }

    return stockDataQuery.data.data.slice(0, daysMap[timeRange])
  }, [stockDataQuery.data, timeRange])

  function handleToggleWatchlist() {
    const watchlist = JSON.parse(
      localStorage.getItem('stock_watchlist') ?? '[]'
    ) as WatchlistItem[]

    const exists = watchlist.some(item => item.symbol === symbol)

    const updated = exists
      ? watchlist.filter(item => item.symbol !== symbol)
      : [
          ...watchlist,
          {
            symbol: symbol ?? '',
            name: name ?? '',
            addedAt: new Date().toISOString()
          }
        ]

    localStorage.setItem('stock_watchlist', JSON.stringify(updated))
    setWatchlistVersion(previous => previous + 1)
  }

  return (
    <TimeRangeViewMode.Root currentMode={timeRange} onModeChange={setTimeRange}>
      <Flex direction="column" flex="1" width="100%">
        <GoBackButton onClick={() => navigate(-1)} />
        <Flex align="center" justify="between" mb="lg">
          <Stack gap="xs">
            <Text as="h2" size="2xl" weight="semibold">
              {symbol}
            </Text>
            <Text color="muted">{name}</Text>
          </Stack>
          <Button
            dangerous={isInWatchList}
            icon={isInWatchList ? 'tabler:eye-off' : 'tabler:eye'}
            variant={isInWatchList ? 'plain' : 'secondary'}
            onClick={handleToggleWatchlist}
          >
            {isInWatchList ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Button>
        </Flex>
        <TimeRangeViewMode.Selector mb="lg" />
        <WithQuery query={stockDataQuery}>
          {() => <CandlestickChart data={filteredData} symbol={symbol ?? ''} />}
        </WithQuery>
      </Flex>
    </TimeRangeViewMode.Root>
  )
}

export default StockChart

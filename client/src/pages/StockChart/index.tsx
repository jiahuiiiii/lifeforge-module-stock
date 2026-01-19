import { useQuery } from '@tanstack/react-query'
import { Button, GoBackButton, WithQuery } from 'lifeforge-ui'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'shared'

import CandlestickChart from '@/components/CandlestickChart'
import forgeAPI from '@/utils/forgeAPI'

import type { WatchlistItem } from '../Dashboard'

type TimeRange = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y'

function StockChart() {
  const navigate = useNavigate()

  const { symbolAndName } = useParams<{ symbolAndName: string }>()

  const [symbol, name] = symbolAndName?.split('||') ?? []

  const [timeRange, setTimeRange] = useState<TimeRange>('1M')

  const [watchlistVersion, setWatchlistVersion] = useState(0)

  const stockDataQuery = useQuery(
    forgeAPI.getStock
      .input({
        symbol: symbol ?? ''
      })
      .queryOptions({
        enabled: !!symbol
      })
  )

  const isInWatchList = useMemo(
    () =>
      watchlistVersion >= 0 &&
      JSON.parse(localStorage.getItem('stock_watchlist') || '[]').some(
        (item: WatchlistItem) => item.symbol === symbol
      ),
    [symbol, watchlistVersion]
  )

  const filteredData = useMemo(() => {
    if (!stockDataQuery.data?.data) return []

    const data = stockDataQuery.data.data

    const daysMap: Record<TimeRange, number> = {
      '1D': 1,
      '5D': 5,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '5Y': 1825
    }

    const days = daysMap[timeRange]

    // FMP returns data in descending order (newest first)
    // So slice(0, days) gives us the most recent 'days' entries
    return data.slice(0, days)
  }, [stockDataQuery.data, timeRange])

  return (
    <div className="flex size-full flex-1 animate-[fadeSlideIn_0.3s_ease-out] flex-col">
      <GoBackButton onClick={() => navigate(-1)} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{symbol}</h2>
          <p className="text-bg-500">{name}</p>
        </div>
        <Button
          as="button"
          dangerous={isInWatchList}
          icon={isInWatchList ? 'tabler:eye-off' : 'tabler:eye'}
          variant={isInWatchList ? 'plain' : 'secondary'}
          onClick={() => {
            const watchlist = JSON.parse(
              localStorage.getItem('stock_watchlist') || '[]'
            )

            const exists = watchlist.some(
              (item: WatchlistItem) => item.symbol === symbol
            )

            if (exists) {
              const updated = watchlist.filter(
                (item: WatchlistItem) => item.symbol !== symbol
              )

              localStorage.setItem('stock_watchlist', JSON.stringify(updated))
            } else {
              watchlist.push({
                symbol,
                name,
                addedAt: new Date().toISOString()
              })
              localStorage.setItem('stock_watchlist', JSON.stringify(watchlist))
            }

            // Force re-render
            setWatchlistVersion(prev => prev + 1)
            window.dispatchEvent(new Event('storage'))
          }}
        >
          {isInWatchList ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </Button>
      </div>
      <div className="my-6 flex items-center gap-2">
        <span className="text-bg-500 text-sm">Time Range:</span>
        <div className="bg-bg-200 dark:bg-bg-700 flex rounded-lg p-0.5">
          {(['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'] as TimeRange[]).map(
            range => (
              <button
                key={range}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-bg-50 text-bg-900 dark:bg-bg-800 dark:text-bg-100 shadow-sm'
                    : 'text-bg-500 hover:text-bg-700 dark:hover:text-bg-300'
                }`}
                type="button"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            )
          )}
        </div>
      </div>
      <WithQuery query={stockDataQuery}>
        {() => <CandlestickChart data={filteredData} symbol={symbol} />}
      </WithQuery>
    </div>
  )
}

export default StockChart

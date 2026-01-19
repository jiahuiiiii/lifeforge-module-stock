import { Icon } from '@iconify/react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { Button, ModuleHeader } from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'

import forgeAPI from '@/utils/forgeAPI'

import AddHoldingModal from './components/AddHoldingModal'
import EditHoldingModal from './components/EditHoldingModal'
import HoldingsTable from './components/HoldingsTable'
import PerformanceChart from './components/PerformanceChart'
import PortfolioSelector from './components/PortfolioSelector'
import PortfolioSummary from './components/PortfolioSummary'
import { type PortfolioHolding, usePortfolioStore } from './store'

const BENCHMARKS = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'NASDAQ 100' },
  { symbol: 'DIA', name: 'Dow Jones' }
]

const TIME_RANGES = ['1W', '1M', '3M', 'YTD', '1Y', 'ALL']

export default function Portfolio() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY')

  const [timeRange, setTimeRange] = useState('1M')

  const [editingHolding, setEditingHolding] = useState<PortfolioHolding | null>(
    null
  )

  const portfolios = usePortfolioStore(s => s.portfolios)

  const activePortfolioId = usePortfolioStore(s => s.activePortfolioId)

  const addHolding = usePortfolioStore(s => s.addHolding)

  const removeHolding = usePortfolioStore(s => s.removeHolding)

  const recordValue = usePortfolioStore(s => s.recordValue)

  const updateHolding = usePortfolioStore(s => s.updateHolding)

  // Get active portfolio data
  const activePortfolio = useMemo(
    () => portfolios.find(p => p.id === activePortfolioId),
    [portfolios, activePortfolioId]
  )

  const holdings = activePortfolio?.holdings ?? []

  const _valueHistory = activePortfolio?.valueHistory ?? []

  // Fetch quotes for all holdings
  const quoteQueries = useQueries({
    queries: holdings.map(holding =>
      forgeAPI.getQuote.input({ symbol: holding.symbol }).queryOptions({
        refetchInterval: 60000,
        enabled: !!holding.symbol,
        retry: 0
      })
    )
  })

  // Fetch historical data for each holding (for chart)
  const holdingHistoryQueries = useQueries({
    queries: holdings.map(holding =>
      forgeAPI.getStock.input({ symbol: holding.symbol }).queryOptions({
        enabled: !!holding.symbol,
        staleTime: 300000
      })
    )
  })

  // Fetch benchmark historical data
  const benchmarkQuery = useQuery(
    forgeAPI.getStock.input({ symbol: selectedBenchmark }).queryOptions({
      enabled: holdings.length > 0,
      staleTime: 300000
    })
  )

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

  // Calculate portfolio summary
  const summary = useMemo(() => {
    let totalValue = 0
    let totalCost = 0
    let dayChange = 0

    for (const holding of holdingsWithPrices) {
      totalValue += holding.shares * holding.currentPrice
      totalCost += holding.shares * holding.avgCost
      dayChange += holding.shares * holding.change
    }

    const dayChangePercent =
      totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0

    return { totalValue, totalCost, dayChange, dayChangePercent }
  }, [holdingsWithPrices])

  // Record portfolio value daily
  useEffect(() => {
    if (summary.totalValue > 0) {
      recordValue(summary.totalValue)
    }
  }, [summary.totalValue, recordValue])

  // Determine range start date based on selection
  const rangeStartDate = useMemo(() => {
    const now = new Date()

    const start = new Date()

    switch (timeRange) {
      case '1W':
        start.setDate(now.getDate() - 7)
        break
      case '1M':
        start.setMonth(now.getMonth() - 1)
        break
      case '3M':
        start.setMonth(now.getMonth() - 3)
        break
      case 'YTD':
        start.setMonth(0, 1) // Jan 1st of current year
        break
      case '1Y':
        start.setFullYear(now.getFullYear() - 1)
        break
      case 'ALL':
        return null // No start date filter
      default:
        start.setMonth(now.getMonth() - 1)
    }

    return start.toISOString().split('T')[0]
  }, [timeRange])

  // Prepare benchmark data for chart
  const benchmarkChartData = useMemo(() => {
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

  // Prepare portfolio data for chart (compute from historical stock prices)
  const portfolioChartData = useMemo(() => {
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

  const isLoading = quoteQueries.some(q => q.isLoading)

  // No portfolios exist - show create first portfolio state
  if (portfolios.length === 0) {
    return (
      <div className="animate-[fadeSlideIn_0.3s_ease-out]">
        <ModuleHeader title="Portfolio" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="bg-bg-200 dark:bg-bg-700 flex size-24 items-center justify-center rounded-full">
            <Icon className="text-bg-400 size-12" icon="tabler:briefcase" />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="mb-1 text-lg font-semibold">No Portfolios Yet</h3>
            <p className="text-bg-500 mb-4 max-w-sm">
              Create your first portfolio to start tracking your virtual
              holdings.
            </p>
            <PortfolioSelector />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 animate-[fadeSlideIn_0.3s_ease-out] flex-col">
      <ModuleHeader title="Portfolio" />

      <div className="mb-4 flex items-center justify-between">
        <PortfolioSelector />
        {holdings.length > 0 && (
          <Button icon="tabler:plus" onClick={() => setIsAddModalOpen(true)}>
            Add Holding
          </Button>
        )}
      </div>

      {holdings.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="bg-bg-200 dark:bg-bg-700 flex size-24 items-center justify-center rounded-full">
            <Icon className="text-bg-400 size-12" icon="tabler:chart-pie" />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="mb-1 text-lg font-semibold">No Holdings Yet</h3>
            <p className="text-bg-500 mb-4 max-w-sm">
              Start building your virtual portfolio by adding your first stock
              holding.
            </p>
            <Button icon="tabler:plus" onClick={() => setIsAddModalOpen(true)}>
              Add Your First Holding
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <PortfolioSummary
            dayChange={summary.dayChange}
            dayChangePercent={summary.dayChangePercent}
            totalCost={summary.totalCost}
            totalValue={summary.totalValue}
          />

          {/* Performance Chart with Controls */}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
              {/* Benchmark Selector */}
              <div className="flex items-center gap-2">
                <span className="text-bg-500 text-sm">Compare:</span>
                <div className="bg-bg-200 dark:bg-bg-700 flex rounded-lg p-0.5">
                  {BENCHMARKS.map(b => (
                    <button
                      key={b.symbol}
                      className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                        selectedBenchmark === b.symbol
                          ? 'bg-custom-500 text-white shadow-sm'
                          : 'text-bg-500 hover:text-bg-700 dark:hover:text-bg-300'
                      }`}
                      type="button"
                      onClick={() => setSelectedBenchmark(b.symbol)}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range Selector */}
              <div className="bg-bg-200 dark:bg-bg-700 flex rounded-lg p-0.5">
                {TIME_RANGES.map(range => (
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
                ))}
              </div>
            </div>

            <PerformanceChart
              benchmarkData={benchmarkChartData}
              benchmarkSymbol={
                BENCHMARKS.find(b => b.symbol === selectedBenchmark)?.name ??
                selectedBenchmark
              }
              error={benchmarkQuery.error}
              isLoading={benchmarkQuery.isLoading}
              portfolioData={portfolioChartData}
              portfolioName={activePortfolio?.name ?? 'My Portfolio'}
              range={timeRange}
            />
          </div>

          <HoldingsTable
            holdings={holdingsWithPrices}
            isLoading={isLoading}
            onEdit={holding => setEditingHolding(holding)}
            onRemove={removeHolding}
          />
        </div>
      )}

      <AddHoldingModal
        isOpen={isAddModalOpen}
        onAdd={addHolding}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditHoldingModal
        holding={editingHolding}
        isOpen={editingHolding !== null}
        onClose={() => setEditingHolding(null)}
        onSave={updateHolding}
      />
    </div>
  )
}

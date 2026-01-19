import { Card } from 'lifeforge-ui'
import { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { usePersonalization } from 'shared'
import COLORS from 'tailwindcss/colors'

interface PerformanceChartProps {
  portfolioData: Array<{ date: string; value: number }>
  portfolioName: string
  benchmarkData: Array<{ date: string; value: number }>
  benchmarkSymbol: string
  isLoading: boolean
  range?: string
  error?: Error | null
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Card className="border-bg-200 dark:border-bg-700/50 border">
        <p className="mb-2 text-sm font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-bg-500">{entry.name}:</span>
            <span className="font-medium">
              {entry.value >= 0 ? '+' : ''}
              {entry.value.toFixed(2)}%
            </span>
          </div>
        ))}
      </Card>
    )
  }

  return null
}

export default function PerformanceChart({
  portfolioData,
  portfolioName,
  benchmarkData,
  benchmarkSymbol,
  isLoading,
  range = '1M',
  error
}: PerformanceChartProps) {
  const { bgTempPalette, derivedTheme, derivedThemeColor } =
    usePersonalization()

  // Merge portfolio and benchmark data by date, normalize to % change from start
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

  if (error) {
    const isPlanLimit = error.message.includes('API_PLAN_LIMIT')

    return (
      <Card>
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
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <div className="flex-center h-64">
          <div className="text-bg-500">Loading performance data...</div>
        </div>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <div className="flex-center h-64">
          <div className="text-bg-500">No performance data available</div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="mb-4 font-semibold">Performance vs {benchmarkSymbol}</h3>
      <div className="h-64">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart
            data={chartData}
            margin={{ bottom: 5, left: 10, right: 20, top: 5 }}
          >
            <CartesianGrid
              stroke={
                derivedTheme === 'light'
                  ? bgTempPalette[300]
                  : bgTempPalette[700]
              }
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickFormatter={date => {
                const d = new Date(date)

                if (range === '1Y' || range === 'ALL') {
                  return d.toLocaleDateString(undefined, {
                    month: 'short',
                    year: '2-digit'
                  })
                }

                if (range === 'YTD') {
                  return d.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })
                }

                // Default 1W, 1M, 3M
                return `${d.getMonth() + 1}/${d.getDate()}`
              }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={value => `${value.toFixed(0)}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend />

            <Line
              connectNulls
              dataKey="portfolio"
              dot={{ r: 3 }}
              name={portfolioName}
              stroke={derivedThemeColor}
              strokeWidth={2}
              type="monotone"
            />
            <Line
              connectNulls
              dataKey="benchmark"
              dot={false}
              name={benchmarkSymbol}
              stroke={COLORS.blue[500]}
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

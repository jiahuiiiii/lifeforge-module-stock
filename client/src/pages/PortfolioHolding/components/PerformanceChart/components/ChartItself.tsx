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

import CustomTooltip from './CustomTooltip'

function ChartItself({
  chartData,
  portfolioName,
  benchmarkSymbol,
  timeRange
}: {
  chartData: {
    date: string
    portfolio: number | null
    benchmark: number | null
  }[]
  portfolioName: string
  benchmarkSymbol: string
  timeRange: string
}) {
  const { bgTempPalette, derivedTheme, derivedThemeColor } =
    usePersonalization()

  return (
    <>
      <div className="h-96">
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

                if (timeRange === '1Y' || timeRange === 'ALL') {
                  return d.toLocaleDateString(undefined, {
                    month: 'short',
                    year: '2-digit'
                  })
                }

                if (timeRange === 'YTD') {
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
    </>
  )
}

export default ChartItself

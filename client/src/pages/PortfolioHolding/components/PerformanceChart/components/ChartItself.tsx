import dayjs from 'dayjs'
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

import { Box, COLORS, usePersonalization } from '@lifeforge/ui'

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
    <Box height="24em">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart
          data={chartData}
          margin={{ bottom: 5, left: 10, right: 20, top: 5 }}
        >
          <CartesianGrid
            stroke={
              derivedTheme === 'light' ? bgTempPalette[300] : bgTempPalette[700]
            }
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={date => {
              if (timeRange === '1Y' || timeRange === 'ALL') {
                return dayjs(date).format('MMM YY')
              }

              if (timeRange === 'YTD') {
                return dayjs(date).format('MMM D')
              }

              return dayjs(date).format('M/D')
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
            stroke={COLORS['blue-500']}
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default ChartItself

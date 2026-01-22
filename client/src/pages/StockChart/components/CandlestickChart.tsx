/* eslint-disable unused-imports/no-unused-vars */
import { Card } from 'lifeforge-ui'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { usePersonalization } from 'shared'
import COLORS from 'tailwindcss/colors'

interface OHLCData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface CandlestickChartProps {
  data: OHLCData[]
  symbol: string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ payload: PreparedData }>
}

interface PreparedData extends OHLCData {
  openClose: [number, number]
  candleWidth: number
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload

    return (
      <Card className="border-bg-200 dark:border-bg-700/50 border">
        <p className="mb-2 font-semibold">{data.date}</p>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-bg-500 font-medium">Open:</span> $
            {data.open.toFixed(2)}
          </p>
          <p>
            <span className="text-bg-500 font-medium">High:</span> $
            {data.high.toFixed(2)}
          </p>
          <p>
            <span className="text-bg-500 font-medium">Low:</span> $
            {data.low.toFixed(2)}
          </p>
          <p>
            <span className="text-bg-500 font-medium">Close:</span> $
            {data.close.toFixed(2)}
          </p>
          <p>
            <span className="text-bg-500 font-medium">Volume:</span>{' '}
            {data.volume.toLocaleString()}
          </p>
        </div>
      </Card>
    )
  }

  return null
}

// Custom candlestick shape for Bar component
function Candlestick(props: any) {
  const {
    x,
    y,
    width,
    height,
    low,
    high,
    openClose,
    background,
    bgTempPalette,
    isActive
  } = props

  if (!openClose) return null

  const [open, close] = openClose

  const isGrowing = open < close

  const color = isGrowing ? COLORS.green[500] : COLORS.red[500]

  const ratio = Math.abs(height / (open - close))

  return (
    <g>
      {isActive && background && (
        <rect
          fill={bgTempPalette?.[500] || COLORS.gray[500]}
          fillOpacity={0.2}
          height={background.height}
          width={background.width}
          x={background.x}
          y={background.y}
        />
      )}
      <g fill={color} stroke={color} strokeWidth="1">
        {/* Body rectangle */}
        <path
          d={`
            M ${x},${y}
            L ${x},${y + height}
            L ${x + width},${y + height}
            L ${x + width},${y}
            Z
          `}
        />
        {/* Bottom wick */}
        {isGrowing ? (
          <path
            d={`
              M ${x + width / 2}, ${y + height}
              v ${(open - low) * ratio}
            `}
          />
        ) : (
          <path
            d={`
              M ${x + width / 2}, ${y}
              v ${(close - low) * ratio}
            `}
          />
        )}
        {/* Top wick */}
        {isGrowing ? (
          <path
            d={`
              M ${x + width / 2}, ${y}
              v ${(close - high) * ratio}
            `}
          />
        ) : (
          <path
            d={`
              M ${x + width / 2}, ${y + height}
              v ${(open - high) * ratio}
            `}
          />
        )}
      </g>
    </g>
  )
}

export default function CandlestickChart({
  data,
}: CandlestickChartProps) {
  const { bgTempPalette, derivedTheme } = usePersonalization()

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // FMP API returns data in descending order (newest first)
  // We want to display oldest to newest (left to right), so reverse it
  const chartData = [...data].reverse()

  // Calculate dynamic candlestick width based on data points
  const calculateCandleWidth = (dataLength: number) => {
    if (dataLength <= 5) return 20
    if (dataLength <= 30) return 12
    if (dataLength <= 90) return 8
    if (dataLength <= 180) return 6
    if (dataLength <= 365) return 4

    return 3
  }

  const candleWidth = calculateCandleWidth(chartData.length)

  // Prepare data for candlestick chart
  const preparedData: PreparedData[] = chartData.map(item => ({
    ...item,
    openClose: [item.open, item.close] as [number, number],
    candleWidth
  }))

  // Calculate Y-axis domain
  const minValue = preparedData.reduce((min, item) => {
    const currentMin = Math.min(item.low, item.open, item.close)

    return currentMin < min ? currentMin : min
  }, preparedData[0]?.low || 0)

  const maxValue = preparedData.reduce((max, item) => {
    const currentMax = Math.max(item.high, item.open, item.close)

    return currentMax > max ? currentMax : max
  }, preparedData[0]?.high || 0)

  const padding = (maxValue - minValue) * 0.1

  const yDomain = [minValue - padding, maxValue + padding]

  return (
    <div className="w-full flex-1">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={preparedData}
          margin={{ bottom: 20, left: 10, right: 20, top: 20 }}
          onMouseLeave={() => setActiveIndex(null)}
          onMouseMove={state => {
            if (state.activeTooltipIndex !== undefined) {
              setActiveIndex(state.activeTooltipIndex)
            }
          }}
        >
          <CartesianGrid
            stroke={
              derivedTheme === 'light' ? bgTempPalette[300] : bgTempPalette[700]
            }
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={date => {
              const d = new Date(date)

              // Show year for longer time ranges
              if (chartData.length > 180) {
                return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`
              }

              return `${d.getMonth() + 1}/${d.getDate()}`
            }}
          />
          <YAxis
            domain={yDomain}
            tick={{ fontSize: 12 }}
            tickFormatter={value => value.toFixed(2)}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar
            dataKey="openClose"
            shape={(props: any) => (
              <Candlestick
                {...props}
                bgTempPalette={bgTempPalette}
                isActive={activeIndex === props.index}
              />
            )}
          >
            {preparedData.map((_, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

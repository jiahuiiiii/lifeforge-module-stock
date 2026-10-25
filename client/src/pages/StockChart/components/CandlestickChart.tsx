/* eslint-disable local/no-native-elements */
import dayjs from 'dayjs'
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

import { Card, COLORS, Flex, Stack, Text, usePersonalization } from '@lifeforge/ui'

interface OhlcData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface CandlestickChartProps {
  data: OhlcData[]
  symbol: string
}

interface PreparedData extends OhlcData {
  openClose: [number, number]
}

interface CandleShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  payload?: PreparedData
  background?: {
    x?: number
    y?: number
    width?: number
    height?: number
  }
}

function CustomTooltip({
  active,
  payload
}: {
  active?: boolean
  payload?: Array<{ payload: PreparedData }>
}) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0]!.payload

  return (
    <Card gap="xs">
      <Text size="sm" weight="semibold">
        {data.date}
      </Text>
      <Stack gap="xs">
        {(
          [
            ['Open', data.open],
            ['High', data.high],
            ['Low', data.low],
            ['Close', data.close]
          ] as const
        ).map(([label, value]) => (
          <Flex key={label} align="center" gap="sm">
            <Text color="muted" size="sm" weight="medium">
              {label}:
            </Text>
            <Text size="sm">${value.toFixed(2)}</Text>
          </Flex>
        ))}
        <Flex align="center" gap="sm">
          <Text color="muted" size="sm" weight="medium">
            Volume:
          </Text>
          <Text size="sm">{data.volume.toLocaleString()}</Text>
        </Flex>
      </Stack>
    </Card>
  )
}

function Candlestick({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  background,
  bgTempPalette,
  isActive
}: CandleShapeProps & {
  bgTempPalette: Record<number, string>
  isActive: boolean
}) {
  if (!payload) return null

  const { open, close, high, low } = payload

  const isGrowing = open < close

  const color = isGrowing ? COLORS['green-500'] : COLORS['red-500']

  const range = Math.abs(close - open)

  const ratio = range === 0 ? 0 : Math.abs(height / range)

  return (
    <g>
      {isActive && background && (
        <rect
          fill={bgTempPalette[500] ?? COLORS['gray-500']}
          fillOpacity={0.2}
          height={background.height}
          width={background.width}
          x={background.x}
          y={background.y}
        />
      )}
      <g fill={color} stroke={color} strokeWidth="1">
        <path
          d={`M ${x},${y} L ${x},${y + height} L ${x + width},${y + height} L ${x + width},${y} Z`}
        />
        {isGrowing ? (
          <path d={`M ${x + width / 2}, ${y + height} v ${(open - low) * ratio}`} />
        ) : (
          <path d={`M ${x + width / 2}, ${y} v ${(close - low) * ratio}`} />
        )}
        {isGrowing ? (
          <path d={`M ${x + width / 2}, ${y} v ${(close - high) * ratio}`} />
        ) : (
          <path d={`M ${x + width / 2}, ${y + height} v ${(open - high) * ratio}`} />
        )}
      </g>
    </g>
  )
}


export default function CandlestickChart({ data }: CandlestickChartProps) {
  const { bgTempPalette, derivedTheme } = usePersonalization()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const chartData = [...data].reverse()

  const preparedData: PreparedData[] = chartData.map(item => ({
    ...item,
    openClose: [item.open, item.close]
  }))

  const minValue = preparedData.reduce(
    (min, item) => Math.min(item.low, item.open, item.close, min),
    preparedData[0]?.low ?? 0
  )

  const maxValue = preparedData.reduce(
    (max, item) => Math.max(item.high, item.open, item.close, max),
    preparedData[0]?.high ?? 0
  )

  const padding = (maxValue - minValue) * 0.1

  return (
    <Flex flex="1" minHeight="24em" width="100%">
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
            tickFormatter={date =>
              chartData.length > 180
                ? dayjs(date).format('M/D/YY')
                : dayjs(date).format('M/D')
            }
          />
          <YAxis
            domain={[minValue - padding, maxValue + padding]}
            tick={{ fontSize: 12 }}
            tickFormatter={value => value.toFixed(2)}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar
            dataKey="openClose"
            shape={(props: unknown) => {
              const candleProps = props as CandleShapeProps

              return (
                <Candlestick
                  {...candleProps}
                  bgTempPalette={bgTempPalette}
                  isActive={activeIndex === candleProps.index}
                />
              )
            }}
          >
            {preparedData.map((_, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Flex>
  )
}

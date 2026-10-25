import { useMemo } from 'react'

import { Flex, Grid, Text, Widget } from '@lifeforge/ui'

import type { HoldingWithPrice } from './HoldingsTable'

function PortfolioSummary({
  holdingsWithPrices
}: {
  holdingsWithPrices: HoldingWithPrice[]
}) {

  const summary = useMemo(() => {
    let totalValue = 0
    let totalCost = 0
    let dayChange = 0

    for (const holding of holdingsWithPrices) {
      totalValue += holding.shares * holding.currentPrice
      totalCost += holding.shares * holding.avg_cost
      dayChange += holding.shares * holding.change
    }

    const dayChangePercent =
      totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0

    const totalProfitLoss = totalValue - totalCost

    const totalProfitLossPercent =
      totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0

    return {
      totalValue,
      totalCost,
      dayChange,
      dayChangePercent,
      totalProfitLoss,
      totalProfitLossPercent,
      isPositive: totalProfitLoss >= 0,
      isDayPositive: dayChange >= 0
    }
  }, [holdingsWithPrices])

  return (
    <Grid gap="md" templateCols={{ base: 1, sm: 2, lg: 4 }}>
      <Widget
        icon="tabler:currency-dollar"
        title="widgets.totalValue"
        variant="large-icon"
      >
        <Text size="3xl" weight="semibold">
          ${summary.totalValue.toLocaleString('en-US', {
            minimumFractionDigits: 2
          })}
        </Text>
      </Widget>

      <Widget
        icon="tabler:currency-dollar"
        title="widgets.totalCost"
        variant="large-icon"
      >
        <Text size="3xl" weight="semibold">
          ${summary.totalCost.toLocaleString('en-US', {
            minimumFractionDigits: 2
          })}
        </Text>
      </Widget>

      <Widget
        icon={
          summary.isPositive ? 'tabler:trending-up' : 'tabler:trending-down'
        }
        title="widgets.totalPL"
        variant="large-icon"
      >
        <Flex align="center" gap="sm">
          <Text
            color={summary.isPositive ? 'green-500' : 'red-500'}
            size="3xl"
            weight="semibold"
          >
            {summary.isPositive ? '+' : '-'}$
            {Math.abs(summary.totalProfitLoss).toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}
          </Text>
          <Text size="sm">
            ({summary.isPositive ? '+' : ''}
            {summary.totalProfitLossPercent.toFixed(2)}%)
          </Text>
        </Flex>
      </Widget>

      <Widget
        icon={summary.isDayPositive ? 'tabler:arrow-up' : 'tabler:arrow-down'}
        title="widgets.dayChange"
        variant="large-icon"
      >
        <Flex align="center" gap="sm">
          <Text
            color={summary.isDayPositive ? 'green-500' : 'red-500'}
            size="3xl"
            weight="semibold"
          >
            {summary.isDayPositive ? '+' : '-'}$
            {Math.abs(summary.dayChange).toLocaleString('en-US', {
              minimumFractionDigits: 2
            })}
          </Text>
          <Text size="sm">
            ({summary.isDayPositive ? '+' : ''}
            {summary.dayChangePercent.toFixed(2)}%)
          </Text>
        </Flex>
      </Widget>
    </Grid>
  )
}

export default PortfolioSummary

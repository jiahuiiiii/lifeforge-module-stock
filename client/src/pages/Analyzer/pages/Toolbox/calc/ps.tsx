import z from 'zod'

import { Flex, Icon, Stack, Text } from '@lifeforge/ui'

import { calculatePSRatio } from '@/pages/Analyzer/pages/Toolbox/utils/calcFuncs'

import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:receipt')
  .fields(
    z.object({
      marketCap: z.number(),
      totalSales: z.number()
    })
  )
  .config({
    marketCap: {
      type: 'currency',
      icon: 'tabler:chart-pie',
      label: 'Market Cap',
    },
    totalSales: {
      type: 'currency',
      icon: 'tabler:receipt',
      label: 'Total Sales',
    }
  })
  .result(
    z.object({
      psRatio: z.number().nullable()
    })
  )
  .calculate(({ marketCap, totalSales }) => {
    if (marketCap <= 0 || totalSales <= 0) {
      return { psRatio: null }
    }

    return { psRatio: calculatePSRatio(marketCap, totalSales) }
  })
  .displayResult(
    ({ psRatio }) =>
      psRatio !== null &&
      isFinite(psRatio) && (
        <Stack gap="sm">
          <Flex align="center" justify="between">
            <Stack gap="xs">
              <Text color="muted" size="sm">
                P/S Ratio
              </Text>
              <Text size="2xl" weight="semibold">
                {psRatio.toFixed(2)}x
              </Text>
            </Stack>
          </Flex>
          <Flex align="start" gap="sm">
            <Icon icon="tabler:info-circle" size="1em" style={{ marginTop: '0.125em' }} />
            <Text color="muted" size="sm">
              P/S ratio alone is not sufficient. Must combine with Profit Margin
              check for meaningful analysis.
            </Text>
          </Flex>
        </Stack>
      )
  )

import z from 'zod'

import { Flex, Stack, Text } from '@lifeforge/ui'

import {
  calculateProfitMargin,
  getScore
} from '@/pages/Analyzer/pages/Toolbox/utils/calcFuncs'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'
import parseShorthand from '../utils/parseShorthand'

export default createCalculator('tabler:chart-pie')
  .fields(
    z.object({
      netIncome: z.string(),
      revenue: z.string()
    })
  )
  .config({
    netIncome: {
      icon: 'tabler:wallet',
      label: 'Net Income',
      placeholder: 'e.g., 50M, -10M, 2B'
    },
    revenue: {
      icon: 'tabler:cash',
      label: 'Total Revenue',
      placeholder: 'e.g., 250M, 1B'
    }
  })
  .result(
    z.object({
      margin: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ netIncome, revenue }, settings) => {
    const income = parseShorthand(netIncome)

    const incomeRevenue = parseShorthand(revenue)

    if (isNaN(income) || isNaN(incomeRevenue) || incomeRevenue <= 0) {
      return { margin: null, score: 0 }
    }

    const marginValue = calculateProfitMargin(income, incomeRevenue)

    return {
      margin: marginValue,
      score: getScore(marginValue, settings.margin)
    }
  })
  .displayResult(
    ({ margin, score }) =>
      margin !== null && (
        <Flex align="center" justify="between">
          <Stack gap="xs">
            <Text color="muted" size="sm">
              Profit Margin
            </Text>
            <Text size="2xl" weight="semibold">
              {margin.toFixed(2)}%
            </Text>
          </Stack>
          <ScoreBadge maxScore={20} score={score} />
        </Flex>
      )
  )

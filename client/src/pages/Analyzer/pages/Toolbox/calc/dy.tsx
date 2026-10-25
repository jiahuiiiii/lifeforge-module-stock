import z from 'zod'

import { Flex, Stack, Text } from '@lifeforge/ui'

import {
  calculateDividendYield,
  getScore
} from '@/pages/Analyzer/pages/Toolbox/utils/calcFuncs'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:coin')
  .fields(
    z.object({
      price: z.number(),
      dividend: z.number()
    })
  )
  .config({
    price: {
      type: 'currency',
      icon: 'tabler:currency-dollar',
      label: 'Current Price',
    },
    dividend: {
      type: 'currency',
      icon: 'tabler:coins',
      label: 'Annual Dividend',
    }
  })
  .result(
    z.object({
      dyield: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ price, dividend }, settings) => {
    if (price <= 0) {
      return { dyield: null, score: 0 }
    }

    const yieldValue = calculateDividendYield(price, dividend)

    return {
      dyield: yieldValue,
      score: getScore(yieldValue, settings.dy)
    }
  })
  .displayResult(
    ({ dyield, score }) =>
      dyield !== null && (
        <Flex align="center" justify="between">
          <Stack gap="xs">
            <Text color="muted" size="sm">
              Dividend Yield
            </Text>
            <Text size="2xl" weight="semibold">
              {dyield.toFixed(2)}%
            </Text>
          </Stack>
          <ScoreBadge maxScore={40} score={score} />
        </Flex>
      )
  )

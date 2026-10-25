import z from 'zod'

import { Flex, Stack, Text } from '@lifeforge/ui'

import {
  calculatePERatio,
  getScore
} from '@/pages/Analyzer/pages/Toolbox/utils/calcFuncs'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:percentage')
  .fields(
    z.object({
      price: z.number(),
      eps: z.number()
    })
  )
  .config({
    price: {
      type: 'currency',
      icon: 'tabler:currency-dollar',
      label: 'Current Price',
    },
    eps: {
      type: 'currency',
      icon: 'tabler:coin',
      label: 'EPS',
    }
  })
  .result(
    z.object({
      peRatio: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ price, eps }, settings) => {
    if (price <= 0 || eps <= 0) {
      return { peRatio: null, score: 0 }
    }

    const pe = calculatePERatio(price, eps)

    return { peRatio: pe, score: getScore(pe, settings.pe) }
  })
  .displayResult(
    ({ peRatio, score }) =>
      peRatio !== null && (
        <Flex align="center" justify="between">
          <Stack gap="xs">
            <Text color="muted" size="sm">
              PE Ratio
            </Text>
            <Text size="2xl" weight="semibold">
              {peRatio.toFixed(2)}x
            </Text>
          </Stack>
          <ScoreBadge maxScore={30} score={score} />
        </Flex>
      )
  )

import z from 'zod'

import { Flex, Stack, Text } from '@lifeforge/ui'

import {
  calculateROE,
  getScore
} from '@/pages/Analyzer/pages/Toolbox/utils/calcFuncs'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'
import parseShorthand from '../utils/parseShorthand'

export default createCalculator('tabler:activity')
  .fields(
    z.object({
      netIncome: z.string(),
      equity: z.string()
    })
  )
  .config({
    netIncome: {
      icon: 'tabler:wallet',
      label: 'Net Income',
      placeholder: 'e.g., 50M, -10M, 2B'
    },
    equity: {
      icon: 'tabler:building-bank',
      label: 'Equity',
      placeholder: 'e.g., 300M, 1.5B'
    }
  })
  .result(
    z.object({
      roe: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ netIncome, equity }, settings) => {
    const income = parseShorthand(netIncome)

    const equityValue = parseShorthand(equity)

    if (isNaN(income) || isNaN(equityValue) || equityValue <= 0) {
      return { roe: null, score: 0 }
    }

    const roeValue = calculateROE(income, equityValue)

    return { roe: roeValue, score: getScore(roeValue, settings.roe) }
  })
  .displayResult(
    ({ roe, score }) =>
      roe !== null && (
        <Flex align="center" justify="between">
          <Stack gap="xs">
            <Text color="muted" size="sm">
              Return on Equity
            </Text>
            <Text size="2xl" weight="semibold">
              {roe.toFixed(2)}%
            </Text>
          </Stack>
          <ScoreBadge maxScore={20} score={score} />
        </Flex>
      )
  )

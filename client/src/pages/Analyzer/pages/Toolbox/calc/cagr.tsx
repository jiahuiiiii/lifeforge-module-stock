import z from 'zod'

import { Flex, Stack, Text } from '@lifeforge/ui'

import {
  calculateCAGR,
  getScore
} from '@/pages/Analyzer/pages/Toolbox/utils/calcFuncs'

import ScoreBadge from '../components/ScoreBadge'
import createCalculator from '../utils/calculatorFactory'
import parseShorthand from '../utils/parseShorthand'

export default createCalculator('tabler:trending-up')
  .fields(
    z.object({
      startValue: z.string(),
      endValue: z.string(),
      years: z.number()
    })
  )
  .config({
    startValue: {
      icon: 'tabler:calendar-minus',
      label: 'Start Value',
      placeholder: 'e.g., 100k, 1M, 2B'
    },
    endValue: {
      icon: 'tabler:calendar',
      label: 'End Value',
      placeholder: 'e.g., 150k, 1.5M'
    },
    years: {
      type: 'number',
      icon: 'tabler:hourglass',
      label: 'Years',
      min: 1,
      max: 20
    }
  })
  .result(
    z.object({
      cagr: z.number().nullable(),
      score: z.number()
    })
  )
  .calculate(({ startValue, endValue, years }, settings) => {
    const start = parseShorthand(startValue)

    const end = parseShorthand(endValue)

    if (isNaN(start) || isNaN(end) || start === 0 || years <= 0) {
      return { cagr: null, score: 0 }
    }

    const cagrValue = calculateCAGR(end, start, years)

    return { cagr: cagrValue, score: getScore(cagrValue, settings.cagr) }
  })
  .displayResult(
    ({ cagr, score }) =>
      cagr !== null && (
        <Flex align="center" justify="between">
          <Stack gap="xs">
            <Text color="muted" size="sm">
              Growth Rate
            </Text>
            <Text size="2xl" weight="semibold">
              {cagr.toFixed(2)}%
            </Text>
          </Stack>
          <ScoreBadge maxScore={50} score={score} />
        </Flex>
      )
  )

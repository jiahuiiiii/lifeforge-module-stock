import z from 'zod'

import { COLORS, Flex, Icon, Stack, Text } from '@lifeforge/ui'

import { calculatePEDiscount } from '@/pages/Analyzer/pages/Toolbox/utils/calcFuncs'

import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:history')
  .fields(
    z.object({
      currentPE: z.number(),
      avgPE: z.number()
    })
  )
  .config({
    currentPE: {
      type: 'number',
      icon: 'tabler:percentage',
      label: 'Current PE',
      placeholder: 'e.g., 12'
    },
    avgPE: {
      type: 'number',
      icon: 'tabler:chart-line',
      label: 'Avg PE',
      placeholder: 'e.g., 20'
    }
  })
  .result(
    z.object({
      discount: z.number().nullable(),
      isUndervalued: z.boolean()
    })
  )
  .calculate(({ currentPE, avgPE }) => {
    if (currentPE <= 0 || avgPE <= 0) {
      return { discount: null, isUndervalued: false }
    }

    const discountValue = calculatePEDiscount(currentPE, avgPE)

    return { discount: discountValue, isUndervalued: discountValue >= 25 }
  })
  .displayResult(
    ({ discount, isUndervalued }) =>
      discount !== null && (
        <Flex align="center" justify="between">
          <Stack gap="xs">
            <Text color="muted" size="sm">
              PE Discount
            </Text>
            <Text size="2xl" weight="semibold">
              {discount > 0 ? '+' : ''}
              {discount.toFixed(1)}%
            </Text>
          </Stack>
          <Flex
            align="center"
            gap="sm"
            px="sm"
            py="xs"
            r="full"
            style={{
              border: `1px solid ${isUndervalued ? COLORS['green-500'] : COLORS['yellow-500']}`,
              color: isUndervalued ? COLORS['green-500'] : COLORS['yellow-500']
            }}
          >
            <Icon icon={isUndervalued ? 'tabler:check' : 'tabler:alert-circle'} />
            <Text size="sm" weight="semibold">
              {isUndervalued ? 'Undervalued (Buy Signal)' : 'No safety margin'}
            </Text>
          </Flex>
        </Flex>
      )
  )

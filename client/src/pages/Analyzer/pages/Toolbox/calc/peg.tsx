import z from 'zod'

import { COLORS, Flex, Icon, Stack, Text } from '@lifeforge/ui'

import { calculatePEG } from '@/pages/Analyzer/pages/Toolbox/utils/calcFuncs'

import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:scale')
  .fields(
    z.object({
      peRatio: z.number(),
      cagr: z.number()
    })
  )
  .config({
    peRatio: {
      type: 'number',
      icon: 'tabler:percentage',
      label: 'PE Ratio',
      placeholder: 'e.g., 15'
    },
    cagr: {
      type: 'number',
      icon: 'tabler:trending-up',
      label: 'CAGR',
      placeholder: 'e.g., 20'
    }
  })
  .result(
    z.object({
      peg: z.number().nullable(),
      isPass: z.boolean()
    })
  )
  .calculate(({ peRatio, cagr }) => {
    if (peRatio <= 0 || cagr <= 0) {
      return { peg: null, isPass: false }
    }

    const pegValue = calculatePEG(peRatio, cagr)

    return { peg: pegValue, isPass: pegValue <= 1 }
  })
  .displayResult(
    ({ peg, isPass }) =>
      peg !== null &&
      isFinite(peg) && (
        <Flex align="center" justify="between">
          <Stack gap="xs">
            <Text color="muted" size="sm">
              PEG Ratio
            </Text>
            <Text size="2xl" weight="semibold">
              {peg.toFixed(2)}
            </Text>
          </Stack>
          <Flex
            align="center"
            gap="sm"
            px="sm"
            py="xs"
            r="full"
            style={{
              border: `1px solid ${isPass ? COLORS['green-500'] : COLORS['red-500']}`,
              color: isPass ? COLORS['green-500'] : COLORS['red-500']
            }}
          >
            <Icon icon={isPass ? 'tabler:check' : 'tabler:x'} />
            <Text size="sm" weight="semibold">
              {isPass ? 'Excellent (Zulu Pass)' : 'Overvalued'}
            </Text>
          </Flex>
        </Flex>
      )
  )

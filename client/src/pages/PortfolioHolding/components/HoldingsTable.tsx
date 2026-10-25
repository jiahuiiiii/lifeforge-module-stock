import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Stack, Text } from '@lifeforge/ui'

import type { HoldingEntry } from '..'
import HoldingRow from './HoldingRow'

export interface HoldingWithPrice extends HoldingEntry {
  currentPrice: number
  change: number
  changePercent: number
}

function HoldingsTable({
  holdings,
  isLoading
}: {
  holdings: HoldingWithPrice[]
  isLoading: boolean
}) {
  const { t } = useModuleTranslation()

  return (
    <Card gap="md">
      <Text as="h2" size="lg" weight="semibold">
        {t('table.holdings')}
      </Text>
      <Stack gap="sm">
        {holdings.map(holding => (
          <HoldingRow
            key={holding.id}
            holding={holding}
            isLoading={isLoading}
          />
        ))}
      </Stack>
    </Card>
  )
}

export default HoldingsTable

import { useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Button,
  Card,
  Flex,
  NumberInput,
  Stack,
  Text,
  Widget,
  surface
} from '@lifeforge/ui'

import type { SettingsMap } from '..'

const CASH_FLOW_KEYS = [
  { key: 'profit_inflow', labelKey: 'profitInflow' },
  { key: 'profit_outflow', labelKey: 'profitOutflow' },
  { key: 'loss_inflow', labelKey: 'lossInflow' },
  { key: 'loss_outflow', labelKey: 'lossOutflow' }
] as const

function CashFlowMetricEditor({
  settings,
  localSettings,
  setLocalSettings
}: {
  settings: Record<string, number>
  localSettings: SettingsMap
  setLocalSettings: (settings: SettingsMap) => void
}) {
  const { t } = useModuleTranslation()
  const [isLocked, setIsLocked] = useState(true)

  function updateTier(key: string, value: number) {
    const cashflow = localSettings.cashflow!

    setLocalSettings({
      ...localSettings,
      cashflow: {
        ...cashflow,
        tiers: { ...settings, [key]: value } as SettingsMap['cashflow']['tiers']
      }
    })
  }

  return (
    <Widget
      actionComponent={
        <Button
          icon={isLocked ? 'tabler:lock' : 'tabler:lock-open'}
          variant="plain"
          onClick={() => setIsLocked(!isLocked)}
        >
          {isLocked ? 'unlock' : 'lock'}
        </Button>
      }
      description="settings.cashFlow.description"
      icon="tabler:coin"
      title="settings.cashFlow.title"
    >
      <Stack gap="sm">
        {CASH_FLOW_KEYS.map(item => (
          <Card
            key={item.key}
            align="center"
            bg={{ base: 'bg-100', dark: 'bg-800' }}
            direction="row"
            justify="between"
          >
            <Text color="muted">{t(`settings.cashFlow.${item.labelKey}`)}</Text>
            <Flex align="center" gap="sm">
              <Box width="4em">
                <NumberInput
                  disabled={isLocked}
                  icon="tabler:number"
                  label=""
                  placeholder="0"
                  size="small"
                  value={settings[item.key] ?? 0}
                  variant="plain"
                  wrapperProps={{
                    bg: surface.defaultInteractive
                  }}
                  onChange={value => updateTier(item.key, value)}
                />
              </Box>
              <Text color="muted">{t('settings.metrics.pts')}</Text>
            </Flex>
          </Card>
        ))}
      </Stack>
    </Widget>
  )
}

export default CashFlowMetricEditor

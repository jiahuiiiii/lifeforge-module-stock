import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Button,
  Card,
  Flex,
  Icon,
  NumberInput,
  Stack,
  Text,
  Widget,
  surface
} from '@lifeforge/ui'

import type { SettingsMap } from '..'

export const METRIC_ICONS = {
  cagr: 'tabler:trending-up',
  dy: 'tabler:percentage',
  pe: 'tabler:chart-bar',
  margin: 'tabler:chart-pie',
  roe: 'tabler:activity'
} as const

type MetricConfig = SettingsMap[string]

type ScoringTier = { threshold: number; score: number }

function MetricEditor({
  config,
  metricId,
  localSettings,
  setLocalSettings
}: {
  config: MetricConfig
  metricId: keyof typeof METRIC_ICONS
  localSettings: SettingsMap
  setLocalSettings: (settings: SettingsMap) => void
}) {
  const { t } = useModuleTranslation()

  function updateTiers(tiers: ScoringTier[]) {
    setLocalSettings({
      ...localSettings,
      [metricId]: { ...config, tiers }
    })
  }

  function handleTierChange(
    index: number,
    field: 'threshold' | 'score',
    value: number
  ) {
    if (!Array.isArray(config.tiers)) return

    const tiers = [...config.tiers]

    tiers[index] = { ...tiers[index]!, [field]: value }
    updateTiers(tiers)
  }

  function handleAddTier() {
    if (!Array.isArray(config.tiers)) return

    const lastTier = config.tiers[config.tiers.length - 1]

    updateTiers([
      ...config.tiers,
      {
        threshold: lastTier ? lastTier.threshold - 5 : 0,
        score: lastTier ? Math.max(0, lastTier.score - 10) : 0
      }
    ])
  }

  function handleDeleteTier(index: number) {
    if (!Array.isArray(config.tiers) || config.tiers.length <= 1) return

    updateTiers(config.tiers.filter((_, tierIndex) => tierIndex !== index))
  }

  if (!Array.isArray(config.tiers)) return null

  const tiers = config.tiers

  return (
    <Widget
      actionComponent={
        <Button icon="tabler:plus" variant="plain" onClick={handleAddTier}>
          addTier
        </Button>
      }
      description={
        config.is_inverse
          ? 'settings.metrics.lowerIsBetter'
          : 'settings.metrics.higherIsBetter'
      }
      icon={METRIC_ICONS[metricId]}
      title={config.label}
    >
      <Stack gap="none">
        {tiers.map((tier, index) => (
          <Card
            key={index}
            align="center"
            bg={{ base: 'bg-100', dark: 'bg-800' }}
            direction="row"
            justify="between"
            mb="sm"
          >
            <Flex align="center" gap="sm">
              <Text color="muted">{t('inputs.value')}</Text>
              <Text weight="medium">{config.is_inverse ? '≤' : '≥'}</Text>
              <Box width="4em">
                <NumberInput
                  icon="tabler:number"
                  label=""
                  placeholder="0"
                  size="small"
                  value={tier.threshold === Infinity ? 0 : tier.threshold}
                  variant="plain"
                  wrapperProps={{
                    bg: surface.defaultInteractive
                  }}
                  onChange={value =>
                    handleTierChange(index, 'threshold', value)
                  }
                />
              </Box>
              <Text color="muted">{config.unit}</Text>
            </Flex>
            <Flex align="center" gap="sm">
              <Box width="4em">
                <NumberInput
                  icon="tabler:number"
                  label=""
                  placeholder="0"
                  size="small"
                  value={tier.score}
                  variant="plain"
                  wrapperProps={{
                    bg: surface.defaultInteractive
                  }}
                  onChange={value => handleTierChange(index, 'score', value)}
                />
              </Box>
              <Text color="muted">{t('settings.metrics.pts')}</Text>
              <Button
                disabled={tiers.length <= 1}
                variant="plain"
                onClick={() => handleDeleteTier(index)}
              >
                <Icon icon="tabler:x" />
              </Button>
            </Flex>
          </Card>
        ))}
      </Stack>
    </Widget>
  )
}

export default MetricEditor

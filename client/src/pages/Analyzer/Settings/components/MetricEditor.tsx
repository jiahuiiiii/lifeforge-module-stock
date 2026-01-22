import { Icon } from '@iconify/react'
import type { MetricConfig, ScoringTier } from '@server/utils/defaults'
import { Button, Card, NumberInput, Widget } from 'lifeforge-ui'

export const METRIC_ICONS = {
  cagr: 'tabler:trending-up',
  dy: 'tabler:percentage',
  pe: 'tabler:chart-bar',
  margin: 'tabler:chart-pie',
  roe: 'tabler:activity'
} as const

function MetricEditor({
  config,
  metricId,
  localSettings,
  setLocalSettings
}: {
  config: MetricConfig
  metricId: keyof typeof METRIC_ICONS
  localSettings: Record<string, MetricConfig>
  setLocalSettings: (settings: Record<string, MetricConfig>) => void
}) {
  function updateConfig(newConfig: MetricConfig) {
    setLocalSettings({
      ...localSettings,
      [metricId]: newConfig
    })
  }

  function handleTierChange(
    index: number,
    field: 'threshold' | 'score',
    value: string
  ) {
    if (!Array.isArray(config.tiers)) return

    const numValue = parseFloat(value) || 0

    const newTiers = [...config.tiers]

    newTiers[index] = { ...newTiers[index], [field]: numValue }
    updateConfig({ ...config, tiers: newTiers })
  }

  function handleAddTier() {
    if (!Array.isArray(config.tiers)) return

    const lastTier = config.tiers[config.tiers.length - 1]

    const newTier: ScoringTier = {
      threshold: lastTier ? lastTier.threshold - 5 : 0,
      score: lastTier ? Math.max(0, lastTier.score - 10) : 0
    }

    updateConfig({ ...config, tiers: [...config.tiers, newTier] })
  }

  function handleDeleteTier(index: number) {
    if (!Array.isArray(config.tiers)) return
    if (config.tiers.length <= 1) return

    const newTiers = config.tiers.filter((_, i) => i !== index)

    updateConfig({ ...config, tiers: newTiers })
  }

  if (!Array.isArray(config.tiers)) return null

  return (
    <Widget
      actionComponent={
        <Button
          className=""
          icon="tabler:plus"
          variant="plain"
          onClick={handleAddTier}
        >
          Add Tier
        </Button>
      }
      description={config.isInverse ? 'Lower is better' : 'Higher is better'}
      icon={METRIC_ICONS[metricId]}
      title={config.label}
    >
      <div className="divide-bg-200 dark:divide-bg-700 divide-y">
        {config.tiers.map((tier, index) => (
          <Card key={index} className="flex-between">
            <div className="flex items-center gap-2">
              <span className="text-bg-500">Value</span>
              <span className="font-medium">
                {config.isInverse ? '≤' : '≥'}
              </span>
              <NumberInput
                className="w-16"
                placeholder="0"
                size="small"
                value={tier.threshold === Infinity ? 0 : tier.threshold}
                variant="plain"
                onChange={e =>
                  handleTierChange(index, 'threshold', e.toString())
                }
              />
              <span className="text-bg-500">{config.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <NumberInput
                className="w-16"
                placeholder="0"
                size="small"
                value={tier.score}
                variant="plain"
                onChange={e => handleTierChange(index, 'score', e.toString())}
              />
              <span className="text-bg-500">pts</span>
              <Button
                className="ml-4 p-2!"
                disabled={
                  !Array.isArray(config.tiers) || config.tiers.length <= 1
                }
                variant="plain"
                onClick={() => handleDeleteTier(index)}
              >
                <Icon className="size-4" icon="tabler:x" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Widget>
  )
}

export default MetricEditor

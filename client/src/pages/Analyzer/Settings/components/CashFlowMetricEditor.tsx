import type { CashFlowOption, MetricConfig } from '@server/utils/defaults'
import { Button, Card, NumberInput, Widget } from 'lifeforge-ui'
import { useState } from 'react'

function CashFlowMetricEditor({
  settings,
  localSettings,
  setLocalSettings
}: {
  settings: Record<CashFlowOption, number>
  localSettings: Record<string, MetricConfig>
  setLocalSettings: (settings: Record<string, MetricConfig>) => void
}) {
  const [isCashFlowLocked, setIsCashFlowLocked] = useState(true)

  function updateTiers(tiers: Record<CashFlowOption, number>) {
    setLocalSettings({
      ...localSettings,
      cashflow: {
        ...localSettings.cashflow,
        tiers
      }
    })
  }

  return (
    <Widget
      actionComponent={
        <Button
          icon={isCashFlowLocked ? 'tabler:lock' : 'tabler:lock-open'}
          variant="plain"
          onClick={() => setIsCashFlowLocked(!isCashFlowLocked)}
        >
          {isCashFlowLocked ? 'Unlock' : 'Lock'}
        </Button>
      }
      description="Profit/Loss + Inflow/Outflow"
      icon="tabler:coin"
      title="Cash Flow"
    >
      <div className="divide-bg-200 dark:divide-bg-700 divide-y">
        {[
          { key: 'profit_inflow' as const, label: 'Profit + Net Inflow' },
          {
            key: 'profit_outflow' as const,
            label: 'Profit + Net Outflow'
          },
          { key: 'loss_inflow' as const, label: 'Loss + Net Inflow' },
          { key: 'loss_outflow' as const, label: 'Loss + Net Outflow' }
        ].map(item => (
          <Card key={item.key} className="flex items-center justify-between">
            <span className="text-bg-500">{item.label}</span>
            <div className="flex items-center gap-2">
              <NumberInput
                className="w-16"
                disabled={isCashFlowLocked}
                placeholder="0"
                size="small"
                value={settings[item.key]}
                variant="plain"
                onChange={e =>
                  updateTiers({
                    ...settings,
                    [item.key]: e
                  })
                }
              />
              <span className="text-bg-500">pts</span>
            </div>
          </Card>
        ))}
      </div>
    </Widget>
  )
}

export default CashFlowMetricEditor

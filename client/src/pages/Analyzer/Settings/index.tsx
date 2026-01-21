import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  ConfirmationModal,
  ModuleHeader,
  useModalStore
} from 'lifeforge-ui'
import { useState } from 'react'
import { useNavigate } from 'shared'

import { useAnalyzerStore } from '../store'
import type { MetricConfig, MetricId, ScoringTier } from '../types'

// Icons for each metric - excluding cashflow as it's handled separately
const METRIC_ICONS: Record<string, string> = {
  cagr: 'tabler:trending-up',
  dy: 'tabler:percentage',
  pe: 'tabler:chart-bar',
  margin: 'tabler:chart-pie',
  roe: 'tabler:activity'
}

function MetricEditor({
  config,
  metricId,
  onUpdate
}: {
  config: MetricConfig
  metricId: MetricId
  onUpdate: (newConfig: MetricConfig) => void
}) {
  const handleTierChange = (
    index: number,
    field: 'threshold' | 'score',
    value: string
  ) => {
    const numValue = parseFloat(value) || 0

    const newTiers = [...config.tiers]

    newTiers[index] = { ...newTiers[index], [field]: numValue }
    onUpdate({ ...config, tiers: newTiers })
  }

  const handleAddTier = () => {
    const lastTier = config.tiers[config.tiers.length - 1]

    const newTier: ScoringTier = {
      threshold: lastTier ? lastTier.threshold - 5 : 0,
      score: lastTier ? Math.max(0, lastTier.score - 10) : 0
    }

    onUpdate({ ...config, tiers: [...config.tiers, newTier] })
  }

  const handleDeleteTier = (index: number) => {
    if (config.tiers.length <= 1) return

    const newTiers = config.tiers.filter((_, i) => i !== index)

    onUpdate({ ...config, tiers: newTiers })
  }

  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-custom-500/10 flex size-10 items-center justify-center rounded-lg">
          <Icon
            className="text-custom-500 size-5"
            icon={METRIC_ICONS[metricId]}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{config.label}</h3>
          <span className="text-bg-500 text-xs">
            {config.isInverse ? 'Lower is better' : 'Higher is better'}
          </span>
        </div>
        <Button
          className=""
          icon="tabler:plus"
          variant="secondary"
          onClick={handleAddTier}
        >
          Add Tier
        </Button>
      </div>

      {/* Tiers Table */}
      <div className="bg-bg-100 dark:bg-bg-800/50 overflow-hidden rounded-lg">
        <div className="border-bg-200 dark:border-bg-700 grid grid-cols-[1fr_auto_auto] gap-2 border-b px-3 py-2 text-xs font-medium">
          <span className="text-bg-500">Condition</span>
          <span className="text-bg-500 w-16 text-center">Score</span>
          <span className="w-8" />
        </div>
        {config.tiers.map((tier, index) => (
          <div
            key={index}
            className="border-bg-200/50 dark:border-bg-700/50 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b px-3 py-2 last:border-b-0"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="text-bg-500">Value</span>
              <span className="text-custom-500 font-medium">
                {config.isInverse ? '≤' : '≥'}
              </span>
              <input
                className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-16 rounded border px-2 py-1 text-center text-sm"
                type="number"
                value={tier.threshold === Infinity ? '' : tier.threshold}
                onChange={e =>
                  handleTierChange(index, 'threshold', e.target.value)
                }
              />
              <span className="text-bg-500">{config.unit}</span>
            </div>
            <input
              className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-16 rounded border px-2 py-1 text-center text-sm font-semibold"
              type="number"
              value={tier.score}
              onChange={e => handleTierChange(index, 'score', e.target.value)}
            />
            <button
              className="text-bg-400 flex size-8 items-center justify-center rounded transition-colors hover:text-red-500 disabled:opacity-30"
              disabled={config.tiers.length <= 1}
              title="Delete tier"
              type="button"
              onClick={() => handleDeleteTier(index)}
            >
              <Icon className="size-4" icon="tabler:x" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function Settings() {
  const settings = useAnalyzerStore(s => s.settings)

  const updateMetricConfig = useAnalyzerStore(s => s.updateMetricConfig)

  const resetToDefaults = useAnalyzerStore(s => s.resetToDefaults)

  const logs = useAnalyzerStore(s => s.logs)

  const clearLogs = useAnalyzerStore(s => s.clearLogs)

  const cashFlowScores = useAnalyzerStore(s => s.cashFlowScores)

  const updateCashFlowScore = useAnalyzerStore(s => s.updateCashFlowScore)

  const { open } = useModalStore()

  const navigate = useNavigate()

  const metricIds: MetricId[] = ['cagr', 'dy', 'pe', 'margin', 'roe']

  const [isCashFlowLocked, setIsCashFlowLocked] = useState(true)

  return (
    <div className="animate-[fadeSlideIn_0.3s_ease-out]">
      <ModuleHeader
        icon="tabler:settings"
        namespace="apps.jiahuiiiii$stock"
        title="settings"
        tKey="subsectionsTitleAndDesc"
      />
      <div className="space-y-6">
        {/* Metric Editors + Cash Flow */}
        <div className="grid gap-4 lg:grid-cols-2">
          {metricIds.map(id => (
            <MetricEditor
              key={id}
              config={settings[id]}
              metricId={id}
              onUpdate={newConfig => updateMetricConfig(id, newConfig)}
            />
          ))}

          {/* Cash Flow Card */}
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-custom-500/10 flex size-10 items-center justify-center rounded-lg">
                <Icon className="text-custom-500 size-5" icon="tabler:coin" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Cash Flow</h3>
                <span className="text-bg-500 text-xs">
                  Profit/Loss + Inflow/Outflow
                </span>
              </div>
              <Button
                icon={isCashFlowLocked ? 'tabler:lock' : 'tabler:lock-open'}
                variant="secondary"
                onClick={() => setIsCashFlowLocked(!isCashFlowLocked)}
              >
                {isCashFlowLocked ? 'Unlock' : 'Lock'}
              </Button>
            </div>
            <div className="bg-bg-100 dark:bg-bg-800/50 divide-bg-200 dark:divide-bg-700/50 divide-y rounded-lg">
              <div className="border-bg-200 dark:border-bg-700 grid grid-cols-[1fr_auto_auto] gap-2 border-b px-3 py-2 text-xs font-medium">
                <span className="text-bg-500">Condition</span>
                <span className="text-bg-500 w-16 text-center">Score</span>
                <span className="w-8" />
              </div>
              {[
                { key: 'profit_inflow' as const, label: 'Profit + Net Inflow' },
                {
                  key: 'profit_outflow' as const,
                  label: 'Profit + Net Outflow'
                },
                { key: 'loss_inflow' as const, label: 'Loss + Net Inflow' },
                { key: 'loss_outflow' as const, label: 'Loss + Net Outflow' }
              ].map(item => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-16 rounded border px-2 py-1 text-center text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isCashFlowLocked}
                      min="0"
                      type="number"
                      value={cashFlowScores[item.key]}
                      onChange={e =>
                        updateCashFlowScore(
                          item.key,
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <span className="text-bg-500 text-xs">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-custom-500/10 flex size-10 items-center justify-center rounded-lg">
              <Icon
                className="text-custom-500 size-5"
                icon="tabler:checklist"
              />
            </div>
            <div>
              <h3 className="font-semibold">Scoring Configuration</h3>
              <span className="text-bg-500 text-xs">
                Customize thresholds for each metric. Changes apply immediately.
              </span>
            </div>
          </div>
          <Button
            dangerous
            icon="tabler:refresh"
            variant="secondary"
            onClick={() =>
              open(ConfirmationModal, {
                title: 'Reset to Defaults',
                description:
                  'Are you sure you want to reset all scoring settings to their default values? This action cannot be undone.',
                confirmationButton: 'confirm',
                onConfirm: async () => {
                  resetToDefaults()
                }
              })
            }
          >
            Reset Defaults
          </Button>
        </Card>

        {/* Analysis Logbook - Full Width */}
        <Card className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Icon className="size-5 text-purple-500" icon="tabler:notebook" />
            </div>
            <div>
              <h3 className="font-semibold">Analysis Logbook</h3>
              <span className="text-bg-500 text-xs">
                {logs.length} saved{' '}
                {logs.length === 1 ? 'analysis' : 'analyses'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {logs.length > 0 && (
              <Button
                dangerous
                icon="tabler:trash"
                variant="secondary"
                onClick={() =>
                  open(ConfirmationModal, {
                    title: 'Clear All Logs',
                    description:
                      'Are you sure you want to delete all saved analyses? This action cannot be undone.',
                    confirmationButton: 'delete',
                    onConfirm: async () => {
                      clearLogs()
                    }
                  })
                }
              >
                Clear All Logs
              </Button>
            )}
            <Button
              icon="tabler:external-link"
              variant="secondary"
              onClick={() => navigate('../analyzer/logbook')}
            >
              View Logbook
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

import type { CashFlowOption, MetricConfig } from '@server/utils/defaults'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  ConfirmationModal,
  ModuleHeader,
  OptionsColumn,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import { useAnalyzerStore } from '../store'
import CashFlowMetricEditor from './components/CashFlowMetricEditor'
import MetricEditor, { METRIC_ICONS } from './components/MetricEditor'

export default function Settings() {
  const { open } = useModalStore()

  const queryClient = useQueryClient()

  const settingsQuery = useQuery(forgeAPI.analyzer.settings.list.queryOptions())

  const [localSettings, setLocalSettings] = useState<Record<
    string,
    MetricConfig
  > | null>(null)

  useEffect(() => {
    if (settingsQuery.data && !localSettings) {
      setLocalSettings(settingsQuery.data as Record<string, MetricConfig>)
    }
  }, [settingsQuery.data, localSettings])

  const hasChanges = useMemo(() => {
    if (!localSettings || !settingsQuery.data) return false

    return JSON.stringify(localSettings) !== JSON.stringify(settingsQuery.data)
  }, [localSettings, settingsQuery.data])

  const updateMutation = useMutation({
    mutationFn: async (settings: Record<string, MetricConfig>) => {
      return forgeAPI.analyzer.settings.update.mutate({
        settings: settings as Record<
          string,
          {
            label: string
            unit: '%' | 'x' | 'pts'
            isInverse?: boolean
            tiers:
              | { threshold: number; score: number }[]
              | Record<CashFlowOption, number>
          }
        >
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: forgeAPI.analyzer.settings.list.key
      })
    }
  })

  const resetMutation = useMutation({
    mutationFn: async () => {
      return forgeAPI.analyzer.settings.reset.mutate({})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: forgeAPI.analyzer.settings.list.key
      })
      setLocalSettings(null)
    }
  })

  const logs = useAnalyzerStore(s => s.logs)

  const clearLogs = useAnalyzerStore(s => s.clearLogs)

  return (
    <>
      <ModuleHeader
        icon="tabler:settings"
        namespace="apps.jiahuiiiii$stock"
        title="settings"
        tKey="subsectionsTitleAndDesc"
      />
      <WithQuery query={settingsQuery}>
        {() => (
          <>
            <div className="mb-12 space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {localSettings &&
                  (
                    Object.keys(METRIC_ICONS) as (keyof typeof METRIC_ICONS)[]
                  ).map(id => (
                    <MetricEditor
                      key={id}
                      config={localSettings[id]}
                      localSettings={localSettings}
                      metricId={id}
                      setLocalSettings={setLocalSettings}
                    />
                  ))}
                {localSettings && (
                  <CashFlowMetricEditor
                    localSettings={localSettings}
                    setLocalSettings={setLocalSettings}
                    settings={
                      localSettings.cashflow.tiers as Record<
                        CashFlowOption,
                        number
                      >
                    }
                  />
                )}
              </div>
              <OptionsColumn
                description="Customize thresholds for each metric. Save changes when done."
                icon="tabler:checklist"
                title="Scoring Configuration"
              >
                <div className="flex items-center gap-4">
                  <Button
                    disabled={!hasChanges || updateMutation.isPending}
                    icon="tabler:device-floppy"
                    loading={updateMutation.isPending}
                    onClick={() => {
                      if (localSettings) {
                        updateMutation.mutate(localSettings)
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    dangerous
                    disabled={resetMutation.isPending}
                    icon="tabler:refresh"
                    loading={resetMutation.isPending}
                    variant="secondary"
                    onClick={() =>
                      open(ConfirmationModal, {
                        title: 'Reset to Defaults',
                        description:
                          'Are you sure you want to reset all scoring settings to their default values? This action cannot be undone.',
                        confirmationButton: 'confirm',
                        onConfirm: async () => {
                          resetMutation.mutate()
                        }
                      })
                    }
                  >
                    Reset Defaults
                  </Button>
                </div>
              </OptionsColumn>
              <OptionsColumn
                description="View your saved analyses and access them anytime."
                icon="tabler:notebook"
                title="Analysis Logbook"
              >
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
                    as={Link}
                    icon="tabler:external-link"
                    to="../analyzer/logbook"
                    variant="secondary"
                  >
                    View Logbook
                  </Button>
                </div>
              </OptionsColumn>
            </div>
          </>
        )}
      </WithQuery>
    </>
  )
}

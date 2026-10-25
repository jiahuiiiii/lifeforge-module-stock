import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { type InferOutput, useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ConfirmationModal,
  Grid,
  ModuleHeader,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import CashFlowMetricEditor from './components/CashFlowMetricEditor'
import MetricEditor, { METRIC_ICONS } from './components/MetricEditor'

export type SettingsMap = InferOutput<typeof forgeAPI.analyzer.settings.list>

export default function Settings() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const settingsQuery = useQuery(forgeAPI.analyzer.settings.list.queryOptions())
  const [localSettings, setLocalSettings] = useState<SettingsMap | null>(null)

  useEffect(() => {
    if (settingsQuery.data && !localSettings) {
      setLocalSettings(settingsQuery.data)
    }
  }, [settingsQuery.data, localSettings])

  const hasChanges = useMemo(() => {
    if (!localSettings || !settingsQuery.data) return false

    return JSON.stringify(localSettings) !== JSON.stringify(settingsQuery.data)
  }, [localSettings, settingsQuery.data])

  const updateMutation = useForgeMutation(forgeAPI.analyzer.settings.update, {
    action: 'update',
    queryKey: forgeAPI.analyzer.settings.key,
    onSuccess: () => {
      setLocalSettings(null)
    }
  })

  const resetMutation = useForgeMutation(forgeAPI.analyzer.settings.reset, {
    action: 'update',
    queryKey: forgeAPI.analyzer.settings.key,
    onSuccess: () => {
      setLocalSettings(null)
    }
  })

  return (
    <>
      <ModuleHeader icon="tabler:settings" title="settings" />
      <WithQuery query={settingsQuery}>
        {() => (
          <Stack gap="md" mb="2xl">
            <Grid gap="md" templateCols={{ base: 1, lg: 2 }}>
              {localSettings &&
                (
                  Object.keys(METRIC_ICONS) as (keyof typeof METRIC_ICONS)[]
                ).map(metricId => {
                  const config = localSettings[metricId]

                  if (!config) return null

                  return (
                    <MetricEditor
                      key={metricId}
                      config={config}
                      localSettings={localSettings}
                      metricId={metricId}
                      setLocalSettings={setLocalSettings}
                    />
                  )
                })}
              {localSettings && (
                <CashFlowMetricEditor
                  localSettings={localSettings}
                  setLocalSettings={setLocalSettings}
                  settings={
                    localSettings.cashflow!.tiers as Record<string, number>
                  }
                />
              )}
            </Grid>
            <Button
              disabled={!hasChanges || updateMutation.isPending}
              icon="tabler:device-floppy"
              loading={updateMutation.isPending}
              width="100%"
              onClick={() => {
                if (localSettings) {
                  updateMutation.mutate({ settings: localSettings })
                }
              }}
            >
              saveChanges
            </Button>
            <Button
              dangerous
              disabled={resetMutation.isPending}
              icon="tabler:refresh"
              loading={resetMutation.isPending}
              variant="secondary"
              width="100%"
              onClick={() =>
                open(ConfirmationModal, {
                  title: t('modals.resetToDefaults.title'),
                  description: t('modals.resetToDefaults.description'),
                  onConfirm: async () => {
                    await resetMutation.mutateAsync(undefined)
                  }
                })
              }
            >
              resetDefaults
            </Button>
          </Stack>
        )}
      </WithQuery>
    </>
  )
}

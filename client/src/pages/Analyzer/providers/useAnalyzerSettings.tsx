import type {
  CashFlowOption,
  MetricConfig,
  ScoringTier
} from '@server/utils/defaults'
import { useQuery } from '@tanstack/react-query'
import { WithQuery } from 'lifeforge-ui'
import { type ReactNode, createContext, useContext, useMemo } from 'react'

import forgeAPI from '@/utils/forgeAPI'

interface AnalyzerMetricConfig extends Omit<MetricConfig, 'tiers'> {
  tiers: ScoringTier[]
}

interface AnalyzerSettingsContextValue {
  settings: Record<string, AnalyzerMetricConfig> | null
  cashFlowScores: Record<CashFlowOption, number> | null
}

const AnalyzerSettingsContext = createContext<AnalyzerSettingsContextValue>({
  settings: null,
  cashFlowScores: null
})

export function AnalyzerSettingsProvider({
  children
}: {
  children: ReactNode
}) {
  const query = useQuery(forgeAPI.analyzer.settings.list.queryOptions())

  const settings = useMemo(() => {
    if (!query.data) return null

    const data = query.data as Record<string, MetricConfig>

    const result: Record<string, AnalyzerMetricConfig> = {}

    for (const [key, config] of Object.entries(data)) {
      if (config && Array.isArray(config.tiers)) {
        result[key] = config as AnalyzerMetricConfig
      }
    }

    return result
  }, [query.data])

  const cashFlowScores = useMemo(() => {
    if (!query.data) return null

    const data = query.data as Record<string, MetricConfig>

    const cashflow = data.cashflow

    if (!cashflow || Array.isArray(cashflow.tiers)) return null

    return cashflow.tiers as Record<CashFlowOption, number>
  }, [query.data])

  const value: AnalyzerSettingsContextValue = {
    settings,
    cashFlowScores
  }

  return (
    <WithQuery query={query}>
      {() => (
        <AnalyzerSettingsContext.Provider value={value}>
          {children}
        </AnalyzerSettingsContext.Provider>
      )}
    </WithQuery>
  )
}

export function useAnalyzerSettings() {
  const context = useContext(AnalyzerSettingsContext)

  return context.settings
}

export function useCashFlowScores() {
  const context = useContext(AnalyzerSettingsContext)

  return context.cashFlowScores
}

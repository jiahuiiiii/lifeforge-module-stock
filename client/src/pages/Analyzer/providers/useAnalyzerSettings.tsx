import { useQuery } from '@tanstack/react-query'
import { type ReactNode, createContext, useContext, useMemo } from 'react'

import type { InferOutput } from '@lifeforge/api'
import { WithQuery } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { CashFlowOption } from '../constants/cashFlow'

export interface ScoringTier {
  threshold: number
  score: number
}

export interface AnalyzerMetricConfig {
  label: string
  unit: '%' | 'x' | 'pts'
  is_inverse: boolean
  tiers: ScoringTier[]
}

type SettingsResponse = InferOutput<typeof forgeAPI.analyzer.settings.list>

export type AnalyzerSettings = Record<string, AnalyzerMetricConfig> & {
  cagr: AnalyzerMetricConfig
  dy: AnalyzerMetricConfig
  pe: AnalyzerMetricConfig
  margin: AnalyzerMetricConfig
  roe: AnalyzerMetricConfig
}

export interface AnalyzerSettingsContextValue {
  settings: AnalyzerSettings | null
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

    const result: Record<string, AnalyzerMetricConfig> = {}

    for (const [key, config] of Object.entries(
      query.data as SettingsResponse
    )) {
      if (Array.isArray(config.tiers)) {
        result[key] = {
          label: config.label,
          unit: config.unit,
          is_inverse: config.is_inverse,
          tiers: config.tiers
        }
      }
    }

    return result as AnalyzerSettings
  }, [query.data])

  const cashFlowScores = useMemo(() => {
    if (!query.data) return null

    const cashflow = (query.data as SettingsResponse).cashflow

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
        <AnalyzerSettingsContext value={value}>
          {children}
        </AnalyzerSettingsContext>
      )}
    </WithQuery>
  )
}

export function useAnalyzerSettings() {
  const context = useContext(AnalyzerSettingsContext)

  if (!context.settings) {
    throw new Error(
      'useAnalyzerSettings must be used within an AnalyzerSettingsProvider'
    )
  }

  return context.settings
}

export function useCashFlowScores() {
  const context = useContext(AnalyzerSettingsContext)

  if (!context.cashFlowScores) {
    throw new Error(
      'useCashFlowScores must be used within an AnalyzerSettingsProvider'
    )
  }

  return context.cashFlowScores
}

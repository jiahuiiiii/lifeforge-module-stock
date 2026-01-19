import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_SETTINGS } from './defaults'
import type {
  CalculatorLog,
  CashFlowOption,
  MetricConfig,
  MetricId,
  ScoringSettings,
  StockLog
} from './types'
import { DEFAULT_CASH_FLOW_SCORES } from './types'

interface AnalyzerState {
  // Configuration (The Rules)
  settings: ScoringSettings
  cashFlowScores: Record<CashFlowOption, number>
  updateMetricConfig: (metricId: MetricId, newConfig: MetricConfig) => void
  updateCashFlowScore: (option: CashFlowOption, score: number) => void
  resetToDefaults: () => void

  // Data Persistence (The History)
  logs: StockLog[]
  addLog: (log: StockLog) => void
  deleteLog: (id: string) => void
  clearLogs: () => void

  // Calculator Logs
  calculatorLogs: CalculatorLog[]
  addCalculatorLog: (log: CalculatorLog) => void
  deleteCalculatorLog: (id: string) => void
}

export const useAnalyzerStore = create<AnalyzerState>()(
  persist(
    set => ({
      // Initial state
      settings: DEFAULT_SETTINGS,
      cashFlowScores: DEFAULT_CASH_FLOW_SCORES,
      logs: [],

      // Settings actions
      updateMetricConfig: (metricId, newConfig) =>
        set(state => ({
          settings: {
            ...state.settings,
            [metricId]: newConfig
          }
        })),

      updateCashFlowScore: (option, score) =>
        set(state => ({
          cashFlowScores: {
            ...state.cashFlowScores,
            [option]: score
          }
        })),

      resetToDefaults: () =>
        set(() => ({
          settings: DEFAULT_SETTINGS,
          cashFlowScores: DEFAULT_CASH_FLOW_SCORES
        })),

      // Log actions
      addLog: log =>
        set(state => ({
          logs: [log, ...state.logs]
        })),

      deleteLog: id =>
        set(state => ({
          logs: state.logs.filter(log => log.id !== id)
        })),

      clearLogs: () =>
        set(() => ({
          logs: []
        })),

      // Calculator log actions
      calculatorLogs: [],

      addCalculatorLog: log =>
        set(state => ({
          calculatorLogs: [log, ...state.calculatorLogs]
        })),

      deleteCalculatorLog: id =>
        set(state => ({
          calculatorLogs: state.calculatorLogs.filter(log => log.id !== id)
        }))
    }),
    {
      name: 'cold-eye-analyzer-storage'
    }
  )
)

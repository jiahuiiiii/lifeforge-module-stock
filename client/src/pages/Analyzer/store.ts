import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CalculatorLog, StockLog } from './types'

interface AnalyzerState {
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
      logs: [],
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

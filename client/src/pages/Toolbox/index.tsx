import { FAB, ModuleHeader, useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnalyzerSettingsProvider } from '../Analyzer/providers/useAnalyzerSettings'
import { useAnalyzerStore } from '../Analyzer/store'
import type { CalculatorLog } from '../Analyzer/types'
import Calculator from './components/Calculator'
import SaveCalculationModal from './components/SaveCalculationModal'
import CALCULATORS from './config'
import type { InitialResults } from './utils/initialResultsInference'
import createInitialResults from './utils/initialResultsInference'

type Results = InitialResults<typeof CALCULATORS>

export default function Toolbox() {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const { open } = useModalStore()

  const [results, setResults] = useState<Results>(() =>
    createInitialResults(CALCULATORS)
  )

  const addCalculatorLog = useAnalyzerStore(s => s.addCalculatorLog)

  const handleResultChange = useCallback(
    <K extends keyof Results>(key: K, result: Results[K]) => {
      setResults(prev => ({ ...prev, [key]: result }))
    },
    []
  )

  const handleSave = (info: {
    ticker: string
    name: string
    exchange: string
    date: string
  }) => {
    const log: CalculatorLog = {
      id: crypto.randomUUID(),
      ticker: info.ticker,
      name: info.name || undefined,
      exchange: info.exchange || undefined,
      date: info.date,
      cagr: results.cagr.cagr ?? undefined,
      cagrScore: results.cagr.score,
      dy: results.dy.dyield ?? undefined,
      dyScore: results.dy.score,
      pe: results.pe.peRatio ?? undefined,
      peScore: results.pe.score,
      margin: results.margin.margin ?? undefined,
      marginScore: results.margin.score,
      roe: results.roe.roe ?? undefined,
      roeScore: results.roe.score,
      totalScore:
        results.cagr.score +
        results.dy.score +
        results.pe.score +
        results.margin.score +
        results.roe.score
    }

    addCalculatorLog(log)
  }

  const hasAnyValue =
    results.cagr.cagr !== null ||
    results.dy.dyield !== null ||
    results.pe.peRatio !== null ||
    results.margin.margin !== null ||
    results.roe.roe !== null

  return (
    <AnalyzerSettingsProvider>
      <ModuleHeader
        icon="tabler:calculator"
        namespace="apps.jiahuiiiii$stock"
        title="toolbox"
        tKey="subsectionsTitleAndDesc"
      />
      <div className="mb-12 space-y-6">
        {CALCULATORS.map(section => (
          <section key={section.title}>
            <h2 className="text-bg-500 mb-3 flex items-center gap-2 font-semibold tracking-wide">
              <span
                className="h-6 w-1 rounded-full"
                style={{ backgroundColor: section.color }}
              />
              {t(`calculators.categories.${section.title}`)}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(section.children).map(([key, config]) => (
                <Calculator
                  key={key}
                  calculatorKey={key}
                  color={section.color}
                  config={config}
                  onResultChange={result =>
                    handleResultChange(
                      key as keyof Results,
                      result as Results[keyof Results]
                    )
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>
      {hasAnyValue && (
        <FAB
          icon="tabler:device-floppy"
          visibilityBreakpoint={false}
          onClick={() =>
            open(SaveCalculationModal, {
              onSave: handleSave
            })
          }
        >
          Save
        </FAB>
      )}
    </AnalyzerSettingsProvider>
  )
}

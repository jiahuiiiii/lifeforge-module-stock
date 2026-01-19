import { ModuleHeader } from 'lifeforge-ui'
import { useCallback, useState } from 'react'

import SaveCalculationModal from '../components/SaveCalculationModal'
import CAGRCalculator from '../components/calculators/CAGRCalculator'
import DividendYieldCalculator from '../components/calculators/DividendYieldCalculator'
import HistoricalPEDiscount from '../components/calculators/HistoricalPEDiscount'
import PERatioCalculator from '../components/calculators/PERatioCalculator'
import PSScanner from '../components/calculators/PSScanner'
import ProfitMarginCalculator from '../components/calculators/ProfitMarginCalculator'
import ROECalculator from '../components/calculators/ROECalculator'
import ZuluChecker from '../components/calculators/ZuluChecker'
import { useAnalyzerStore } from '../store'
import type { CalculatorLog } from '../types'

export default function Toolbox() {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)

  // Track calculator values
  const [cagrData, setCagrData] = useState<{
    value: number | null
    score: number
  }>({ value: null, score: 0 })

  const [dyData, setDyData] = useState<{ value: number | null; score: number }>(
    { value: null, score: 0 }
  )

  const [peData, setPeData] = useState<{ value: number | null; score: number }>(
    { value: null, score: 0 }
  )

  const [marginData, setMarginData] = useState<{
    value: number | null
    score: number
  }>({ value: null, score: 0 })

  const [roeData, setRoeData] = useState<{
    value: number | null
    score: number
  }>({ value: null, score: 0 })

  const addCalculatorLog = useAnalyzerStore(s => s.addCalculatorLog)

  // Memoized callbacks to prevent unnecessary re-renders
  const handleCagrChange = useCallback(
    (value: number | null, score: number) => {
      setCagrData({ value, score })
    },
    []
  )

  const handleDyChange = useCallback((value: number | null, score: number) => {
    setDyData({ value, score })
  }, [])

  const handlePeChange = useCallback((value: number | null, score: number) => {
    setPeData({ value, score })
  }, [])

  const handleMarginChange = useCallback(
    (value: number | null, score: number) => {
      setMarginData({ value, score })
    },
    []
  )

  const handleRoeChange = useCallback((value: number | null, score: number) => {
    setRoeData({ value, score })
  }, [])

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
      cagr: cagrData.value ?? undefined,
      cagrScore: cagrData.score,
      dy: dyData.value ?? undefined,
      dyScore: dyData.score,
      pe: peData.value ?? undefined,
      peScore: peData.score,
      margin: marginData.value ?? undefined,
      marginScore: marginData.score,
      roe: roeData.value ?? undefined,
      roeScore: roeData.score,
      totalScore:
        cagrData.score +
        dyData.score +
        peData.score +
        marginData.score +
        roeData.score
    }

    addCalculatorLog(log)
  }

  // Check if any calculator has a value
  const hasAnyValue =
    cagrData.value !== null ||
    dyData.value !== null ||
    peData.value !== null ||
    marginData.value !== null ||
    roeData.value !== null

  return (
    <div className="animate-[fadeSlideIn_0.3s_ease-out]">
      <ModuleHeader title="Analyzer Toolbox" />
      <div className="space-y-6">
        {/* Row 1: GDP Fundamentals */}
        <section>
          <h2 className="text-bg-500 mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
            <span className="bg-custom-500 size-2 rounded-full" />
            GDP - Creating Wealth
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CAGRCalculator onValueChange={handleCagrChange} />
            <DividendYieldCalculator onValueChange={handleDyChange} />
            <PERatioCalculator onValueChange={handlePeChange} />
          </div>
        </section>

        {/* Row 2: PRC Sustaining Wealth */}
        <section>
          <h2 className="text-bg-500 mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
            <span className="size-2 rounded-full bg-blue-500" />
            PRC - Sustaining Wealth
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ProfitMarginCalculator onValueChange={handleMarginChange} />
            <ROECalculator onValueChange={handleRoeChange} />
          </div>
        </section>

        {/* Row 3: Supplementary Checks */}
        <section>
          <h2 className="text-bg-500 mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
            <span className="size-2 rounded-full bg-purple-500" />
            Supplementary Checks
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ZuluChecker />
            <HistoricalPEDiscount />
            <PSScanner />
          </div>
        </section>
      </div>

      {/* Floating Save Button - only show if there's at least one value */}
      {hasAnyValue && (
        <button
          className="bg-custom-500 hover:bg-custom-600 fixed right-8 bottom-8 flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105"
          type="button"
          onClick={() => setIsSaveModalOpen(true)}
        >
          <span className="size-5">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M5 5a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 17v-6h-4v6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 5v4h6v-4h-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Save
        </button>
      )}

      <SaveCalculationModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

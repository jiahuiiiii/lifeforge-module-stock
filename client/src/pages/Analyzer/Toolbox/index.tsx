import { FAB, ModuleHeader } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import COLORS from 'tailwindcss/colors'

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
    <>
      <ModuleHeader
        icon="tabler:calculator"
        namespace="apps.jiahuiiiii$stock"
        title="analyzer"
        tKey="subsectionsTitleAndDesc"
      />
      <div className="mb-12 space-y-6">
        {[
          {
            title: 'GDP - Creating Wealth',
            color: COLORS.lime[500],
            children: (
              <>
                <CAGRCalculator onValueChange={handleCagrChange} />
                <DividendYieldCalculator onValueChange={handleDyChange} />
                <PERatioCalculator onValueChange={handlePeChange} />
              </>
            )
          },
          {
            title: 'PRC - Sustaining Wealth',
            color: COLORS.blue[500],
            children: (
              <>
                <ProfitMarginCalculator onValueChange={handleMarginChange} />
                <ROECalculator onValueChange={handleRoeChange} />
              </>
            )
          },
          {
            title: 'Supplementary Checks',
            color: COLORS.purple[500],
            children: (
              <>
                <ZuluChecker />
                <HistoricalPEDiscount />
                <PSScanner />
              </>
            )
          }
        ].map(section => (
          <section key={section.title}>
            <h2 className="text-bg-500 mb-3 flex items-center gap-2 font-semibold tracking-wide">
              <span
                className="h-6 w-1 rounded-full"
                style={{ backgroundColor: section.color }}
              />
              {section.title}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.children}
            </div>
          </section>
        ))}
      </div>

      {hasAnyValue && (
        <FAB
          icon="tabler:device-floppy"
          visibilityBreakpoint={false}
          onClick={() => setIsSaveModalOpen(true)}
        >
          Save
        </FAB>
      )}

      <SaveCalculationModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}

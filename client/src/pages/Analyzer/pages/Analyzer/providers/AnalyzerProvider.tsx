import { createContext, useContext, useState } from 'react'

import type { InferOutput } from '@lifeforge/api'
import { WithQueryData } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import useDerivedValues from '../hooks/useDerivedValues'
import type {
  BaseInfo,
  DerivedValues,
  QualitativeChecks,
  RawValues
} from '../types'

type AnalyzerContextValue = {
  phase: number
  setPhase: React.Dispatch<React.SetStateAction<number>>
  baseInfo: BaseInfo
  setBaseInfo: React.Dispatch<React.SetStateAction<BaseInfo>>
  qualitative: QualitativeChecks
  setQualitative: React.Dispatch<React.SetStateAction<QualitativeChecks>>
  rawValues: RawValues
  setRawValues: React.Dispatch<React.SetStateAction<RawValues>>
  derivedValues: DerivedValues
  resetValues: () => void
  calculatorLogs: InferOutput<typeof forgeAPI.analyzer.logs.calculator.list>
}

const AnalyzerContext = createContext<AnalyzerContextValue | undefined>(
  undefined
)

export default function AnalyzerProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [phase, setPhase] = useState(1)

  const [baseInfo, setBaseInfo] = useState<BaseInfo>({
    stockExchange: '',
    ticker: '',
    companyName: ''
  })

  const [qualitative, setQualitative] = useState<QualitativeChecks>({
    valueChain: false,
    dividendPolicy: false,
    management: false,
    moat: false
  })

  const [rawValues, setRawValues] = useState<RawValues>({
    cagr: 0,
    dy: 0,
    pe: 0,
    margin: 0,
    roe: 0,
    cashFlow: 'profit_inflow',
    avgPE: 0
  })

  const derivedValues = useDerivedValues(rawValues)

  function resetValues() {
    setPhase(1)
    setBaseInfo({
      stockExchange: '',
      ticker: '',
      companyName: ''
    })
    setQualitative({
      valueChain: false,
      dividendPolicy: false,
      management: false,
      moat: false
    })
    setRawValues({
      cagr: 0,
      dy: 0,
      pe: 0,
      margin: 0,
      roe: 0,
      cashFlow: 'profit_inflow',
      avgPE: 0
    })
  }

  return (
    <WithQueryData contract={forgeAPI.analyzer.logs.calculator.list}>
      {calculatorLogs => (
        <AnalyzerContext
          value={{
            phase,
            setPhase,
            baseInfo,
            setBaseInfo,
            qualitative,
            setQualitative,
            rawValues,
            setRawValues,
            derivedValues,
            resetValues,
            calculatorLogs
          }}
        >
          {children}
        </AnalyzerContext>
      )}
    </WithQueryData>
  )
}

export function useAnalyzer() {
  const context = useContext(AnalyzerContext)

  if (!context) {
    throw new Error('useAnalyzer must be used within an AnalyzerProvider')
  }

  return context
}

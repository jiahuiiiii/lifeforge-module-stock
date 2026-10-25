import { useMemo } from 'react'

import {
  useAnalyzerSettings,
  useCashFlowScores
} from '@/pages/Analyzer/providers/useAnalyzerSettings'

import { getScore } from '../../Toolbox/utils/calcFuncs'
import type { DerivedValues, RawValues } from '../types'

function useDerivedValues(rawValues: RawValues) {
  const settings = useAnalyzerSettings()
  const cashFlowScores = useCashFlowScores()

  return useMemo<DerivedValues>(() => {
    if (!settings)
      return {
        cagrScore: 0,
        dyScore: 0,
        peScore: 0,
        marginScore: 0,
        roeScore: 0,
        cashFlowScore: 0,
        gdpScore: 0,
        prcScore: 0,
        passedZulu: false,
        undervaluedPE: false
      }

    const cagrScore = getScore(rawValues.cagr, settings.cagr)

    const dyScore = getScore(rawValues.dy, settings.dy)

    const peScore = getScore(rawValues.pe, settings.pe)

    const marginScore = getScore(rawValues.margin, settings.margin)

    const roeScore = getScore(rawValues.roe, settings.roe)

    const cashFlowScore =
      cashFlowScores?.[rawValues.cashFlow as keyof typeof cashFlowScores] ?? 0

    const gdpScore = cagrScore + dyScore + peScore

    const prcScore = marginScore + roeScore + cashFlowScore

    const passedZulu =
      rawValues.cagr > 0 && rawValues.pe / rawValues.cagr <= 1.0

    const undervaluedPE =
      rawValues.pe > 0 &&
      rawValues.avgPE > 0 &&
      (1 - rawValues.pe / rawValues.avgPE) * 100 >= 25

    return {
      cagrScore,
      dyScore,
      peScore,
      marginScore,
      roeScore,
      cashFlowScore,
      gdpScore,
      prcScore,
      passedZulu,
      undervaluedPE
    }
  }, [rawValues, settings, cashFlowScores])
}

export default useDerivedValues

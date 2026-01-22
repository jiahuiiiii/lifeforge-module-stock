import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  Checkbox,
  ListboxInput,
  ListboxOption,
  TextInput
} from 'lifeforge-ui'
import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import type { StockLog } from '@/pages/AnalyzerLogbook/types'

import {
  useAnalyzerSettings,
  useCashFlowScores
} from '../../../providers/useAnalyzerSettings'
import { useAnalyzerStore } from '../../AnalyzerLogbook/store'
import ScoreBadge from '../../Toolbox/components/ScoreBadge'
import { getScore } from '../../Toolbox/utils/calcFuncs'
import {
  CASH_FLOW_OPTIONS,
  type CashFlowOption,
  VERDICTS,
  getVerdict
} from '../types'

interface QualitativeChecks {
  valueChain: boolean
  dividendPolicy: boolean
  management: boolean
  moat: boolean
}

const QUALITATIVE_ITEMS = [
  {
    id: 'valueChain',
    label: 'Value Chain',
    description: 'Does the company have stable needs → Revenue → Profit flow?'
  },
  {
    id: 'dividendPolicy',
    label: 'Dividend Policy',
    description: 'Is there a consistent history of paying dividends?'
  },
  {
    id: 'management',
    label: 'Management Integrity',
    description: 'Is the management honest? (No accounting scandals)'
  },
  {
    id: 'moat',
    label: 'Competitive Moat',
    description: 'Does the company have a clear competitive advantage?'
  }
] as const

export default function GdpPrc() {
  const [phase, setPhase] = useState<1 | 2 | 3>(1)

  const [stockExchange, setStockExchange] = useState('')

  const [ticker, setTicker] = useState('')

  const [companyName, setCompanyName] = useState('')

  const [qualitative, setQualitative] = useState<QualitativeChecks>({
    valueChain: false,
    dividendPolicy: false,
    management: false,
    moat: false
  })

  // GDP inputs
  const [cagrValue, setCagrValue] = useState('')

  const [dyValue, setDyValue] = useState('')

  const [peValue, setPeValue] = useState('')

  // PRC inputs
  const [marginValue, setMarginValue] = useState('')

  const [roeValue, setRoeValue] = useState('')

  const [cashFlowOption, setCashFlowOption] =
    useState<CashFlowOption>('profit_inflow')

  // For Zulu/PE checks
  const [avgPE, setAvgPE] = useState('')

  const settings = useAnalyzerSettings()

  const cashFlowScores = useCashFlowScores()

  const addLog = useAnalyzerStore(s => s.addLog)

  const calculatorLogs = useAnalyzerStore(s => s.calculatorLogs)

  const allQualitativePass = Object.values(qualitative).every(Boolean)

  const scores = useMemo(() => {
    if (!settings) return null

    const cagr = parseFloat(cagrValue) || 0

    const dy = parseFloat(dyValue) || 0

    const pe = parseFloat(peValue) || 0

    const margin = parseFloat(marginValue) || 0

    const roe = parseFloat(roeValue) || 0

    const avgPEVal = parseFloat(avgPE) || 0

    const cagrScore = getScore(cagr, settings.cagr)

    const dyScore = getScore(dy, settings.dy)

    const peScore = getScore(pe, settings.pe)

    const marginScore = getScore(margin, settings.margin)

    const roeScore = getScore(roe, settings.roe)

    const cashFlowScore = cashFlowScores?.[cashFlowOption] ?? 0

    const gdpScore = cagrScore + dyScore + peScore

    const prcScore = marginScore + roeScore + cashFlowScore

    const totalScore = gdpScore + prcScore

    const passedZulu = cagr > 0 && pe / cagr <= 1.0

    const undervaluedPe =
      pe > 0 && avgPEVal > 0 && (1 - pe / avgPEVal) * 100 >= 25

    return {
      cagrScore,
      dyScore,
      peScore,
      marginScore,
      roeScore,
      cashFlowScore,
      gdpScore,
      prcScore,
      totalScore,
      passedZulu,
      undervaluedPe
    }
  }, [
    cagrValue,
    dyValue,
    peValue,
    marginValue,
    roeValue,
    cashFlowOption,
    avgPE,
    settings
  ])

  const verdict = getVerdict(scores?.gdpScore, scores?.prcScore)

  const handleSaveLog = () => {
    if (!scores) return

    const log: StockLog = {
      id: uuid(),
      ticker: ticker.toUpperCase(),
      stockExchange: stockExchange.toUpperCase(),
      companyName,
      date: new Date().toISOString(),
      cagrValue: parseFloat(cagrValue) || 0,
      dyValue: parseFloat(dyValue) || 0,
      peValue: parseFloat(peValue) || 0,
      marginValue: parseFloat(marginValue) || 0,
      roeValue: parseFloat(roeValue) || 0,
      cashFlowOption,
      gdpScore: scores.gdpScore,
      prcScore: scores.prcScore,
      totalScore: scores.totalScore,
      passedZulu: scores.passedZulu,
      undervaluedPe: scores.undervaluedPe,
      qualitativeChecks: qualitative
    }

    addLog(log)

    // Reset form
    setPhase(1)
    setTicker('')
    setStockExchange('')
    setCompanyName('')

    setQualitative({
      valueChain: false,
      dividendPolicy: false,
      management: false,
      moat: false
    })

    setCagrValue('')
    setDyValue('')
    setPeValue('')
    setMarginValue('')
    setRoeValue('')
    setCashFlowOption('profit_inflow')
    setAvgPE('')
  }

  if (!settings || !cashFlowScores || !scores) return null

  return (
    <div className="mx-auto max-w-4xl animate-[fadeSlideIn_0.3s_ease-out] space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map(step => (
          <div key={step} className="flex items-center gap-2">
            <button
              className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                phase === step
                  ? 'bg-custom-500 text-white'
                  : phase > step
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-bg-200 text-bg-500 dark:bg-bg-700'
              }`}
              disabled={step > phase}
              type="button"
              onClick={() => step < phase && setPhase(step as 1 | 2 | 3)}
            >
              {phase > step ? (
                <Icon className="size-4" icon="tabler:check" />
              ) : (
                step
              )}
            </button>
            {step < 3 && (
              <div
                className={`h-0.5 w-8 ${
                  phase > step ? 'bg-green-500' : 'bg-bg-200 dark:bg-bg-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Phase 1: Qualitative Gate */}
      {phase === 1 && (
        <Card key="phase-1" className="animate-[fadeSlideIn_0.3s_ease-out]">
          <h2 className="mb-4 text-xl font-bold">
            Phase 1: Sleep Strategy Gate
          </h2>
          <p className="text-bg-500 mb-6">
            Review these qualitative factors (recommended). You may proceed even
            if not all criteria are met.
          </p>

          <div className="mb-6 space-y-4">
            {QUALITATIVE_ITEMS.map(item => (
              <div
                key={item.id}
                className="border-bg-200 dark:border-bg-700 flex items-start gap-3 rounded-lg border p-4"
              >
                <Checkbox
                  checked={qualitative[item.id]}
                  onCheckedChange={checked =>
                    setQualitative(prev => ({
                      ...prev,
                      [item.id]: checked
                    }))
                  }
                />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-bg-500 text-sm">{item.description}</div>
                </div>
              </div>
            ))}
          </div>

          {!allQualitativePass && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3 text-sm text-yellow-500">
              <Icon className="size-5 shrink-0" icon="tabler:alert-triangle" />
              <span>
                Not all criteria are met. Proceed with caution - investing in
                companies that fail these checks carries higher risk.
              </span>
            </div>
          )}

          <Button
            className="w-full"
            icon="tabler:arrow-right"
            onClick={() => setPhase(2)}
          >
            {allQualitativePass
              ? 'Next: Quantitative Analysis'
              : 'Skip to Quantitative Analysis'}
          </Button>
        </Card>
      )}

      {/* Phase 2: Quantitative Entry */}
      {phase === 2 && (
        <Card
          key="phase-2"
          className="min-h-[600px] animate-[fadeSlideIn_0.3s_ease-out]"
        >
          <h2 className="mb-4 text-xl font-bold">
            Phase 2: Quantitative Data Entry
          </h2>

          <div className="mb-6 flex flex-row gap-4">
            <TextInput
              icon="tabler:building"
              label="Stock Exchange"
              placeholder="e.g., NASDAQ"
              value={stockExchange}
              onChange={setStockExchange}
            />
            <TextInput
              required
              icon="tabler:tag"
              label="Stock Ticker"
              placeholder="e.g., AAPL"
              value={ticker}
              onChange={setTicker}
            />
            <TextInput
              icon="tabler:building-bank"
              label="Company Name"
              placeholder="e.g., Apple Inc."
              value={companyName}
              onChange={setCompanyName}
            />
          </div>

          {/* GDP Section */}
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <span className="bg-custom-500 size-2 rounded-full" />
              GDP - Creating Wealth
              <span className="text-bg-500 ml-auto text-sm font-normal">
                Score: {scores.gdpScore}/100
              </span>
              {(() => {
                // Find the latest log that matches the current ticker
                const matchingLog = ticker.trim()
                  ? calculatorLogs.find(
                      log =>
                        log.ticker.toLowerCase() === ticker.trim().toLowerCase()
                    )
                  : null

                if (!matchingLog) return null

                return (
                  <button
                    className="text-custom-500 hover:text-custom-600 ml-2 flex items-center gap-1 rounded-lg border border-current px-2 py-1 text-xs transition-colors"
                    type="button"
                    onClick={() => {
                      if (matchingLog.cagr !== undefined) {
                        setCagrValue(matchingLog.cagr.toFixed(2))
                      }

                      if (matchingLog.dy !== undefined) {
                        setDyValue(matchingLog.dy.toFixed(2))
                      }

                      if (matchingLog.pe !== undefined) {
                        setPeValue(matchingLog.pe.toFixed(2))
                      }

                      // Also fill in stock info if empty
                      if (!companyName && matchingLog.name) {
                        setCompanyName(matchingLog.name)
                      }

                      if (!stockExchange && matchingLog.exchange) {
                        setStockExchange(matchingLog.exchange)
                      }
                    }}
                  >
                    <Icon className="size-3" icon="tabler:download" />
                    Fetch from Logbook
                  </button>
                )
              })()}
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-bg-500 mb-1 flex items-center justify-between text-sm">
                  <span>G: CAGR (%)</span>
                  <ScoreBadge maxScore={50} score={scores.cagrScore} />
                </div>
                <TextInput
                  required
                  icon="tabler:trending-up"
                  label="CAGR (%)"
                  placeholder="e.g., 15"
                  value={cagrValue}
                  onChange={setCagrValue}
                />
              </div>
              <div>
                <div className="text-bg-500 mb-1 flex items-center justify-between text-sm">
                  <span>D: Dividend Yield (%)</span>
                  <ScoreBadge maxScore={40} score={scores.dyScore} />
                </div>
                <TextInput
                  required
                  icon="tabler:percentage"
                  label="Dividend Yield (%)"
                  placeholder="e.g., 3"
                  value={dyValue}
                  onChange={setDyValue}
                />
              </div>
              <div>
                <div className="text-bg-500 mb-1 flex items-center justify-between text-sm">
                  <span>P: PE Ratio</span>
                  <ScoreBadge maxScore={30} score={scores.peScore} />
                </div>
                <TextInput
                  required
                  icon="tabler:chart-bar"
                  label="PE Ratio"
                  placeholder="e.g., 12"
                  value={peValue}
                  onChange={setPeValue}
                />
              </div>
            </div>
          </div>

          {/* PRC Section */}
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <span className="size-2 rounded-full bg-blue-500" />
              PRC - Sustaining Wealth
              <span className="text-bg-500 ml-auto text-sm font-normal">
                Score: {scores.prcScore}/100
              </span>
              {(() => {
                // Find the latest log that matches the current ticker
                const matchingLog = ticker.trim()
                  ? calculatorLogs.find(
                      log =>
                        log.ticker.toLowerCase() === ticker.trim().toLowerCase()
                    )
                  : null

                if (!matchingLog) return null

                // Only show if there's margin or roe data
                if (
                  matchingLog.margin === undefined &&
                  matchingLog.roe === undefined
                )
                  return null

                return (
                  <button
                    className="text-custom-500 hover:text-custom-600 ml-2 flex items-center gap-1 rounded-lg border border-current px-2 py-1 text-xs transition-colors"
                    type="button"
                    onClick={() => {
                      if (matchingLog.margin !== undefined) {
                        setMarginValue(matchingLog.margin.toFixed(2))
                      }

                      if (matchingLog.roe !== undefined) {
                        setRoeValue(matchingLog.roe.toFixed(2))
                      }
                    }}
                  >
                    <Icon className="size-3" icon="tabler:download" />
                    Fetch from Logbook
                  </button>
                )
              })()}
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-bg-500 mb-1 flex items-center justify-between text-sm">
                  <span>P: Profit Margin (%)</span>
                  <ScoreBadge maxScore={20} score={scores.marginScore} />
                </div>
                <TextInput
                  required
                  icon="tabler:chart-pie"
                  label="Profit Margin (%)"
                  placeholder="e.g., 20"
                  value={marginValue}
                  onChange={setMarginValue}
                />
              </div>
              <div>
                <div className="text-bg-500 mb-1 flex items-center justify-between text-sm">
                  <span>R: ROE (%)</span>
                  <ScoreBadge maxScore={20} score={scores.roeScore} />
                </div>
                <TextInput
                  required
                  icon="tabler:activity"
                  label="ROE (%)"
                  placeholder="e.g., 18"
                  value={roeValue}
                  onChange={setRoeValue}
                />
              </div>
              <div>
                <div className="text-bg-500 mb-1 flex items-center justify-between text-sm">
                  <span>C: Cash Flow</span>
                  <ScoreBadge maxScore={40} score={scores.cashFlowScore} />
                </div>
                <ListboxInput
                  buttonContent={
                    <span>
                      {CASH_FLOW_OPTIONS.find(o => o.value === cashFlowOption)
                        ?.label ?? 'Select'}
                    </span>
                  }
                  icon="tabler:coin"
                  label="Cash Flow"
                  value={cashFlowOption}
                  onChange={value => setCashFlowOption(value as CashFlowOption)}
                >
                  {CASH_FLOW_OPTIONS.map(opt => (
                    <ListboxOption
                      key={opt.value}
                      label={`${opt.label} (${cashFlowScores[opt.value]}pts)`}
                      value={opt.value}
                    />
                  ))}
                </ListboxInput>
              </div>
            </div>
          </div>

          {/* Optional: For Zulu/PE Discount checks */}
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <span className="size-2 rounded-full bg-purple-500" />
              Optional: Additional Checks
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                icon="tabler:history"
                label="10-Year Avg PE (for PE Discount check)"
                placeholder="e.g., 20"
                value={avgPE}
                onChange={setAvgPE}
              />
            </div>
            <div className="mt-3 flex gap-4">
              {scores.passedZulu && (
                <div className="flex items-center gap-1.5 text-sm text-green-500">
                  <Icon icon="tabler:check" />
                  Zulu Pass (PEG ≤ 1.0)
                </div>
              )}
              {scores.undervaluedPe && (
                <div className="flex items-center gap-1.5 text-sm text-green-500">
                  <Icon icon="tabler:check" />
                  Undervalued (PE ≥25% discount)
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              icon="tabler:arrow-left"
              variant="secondary"
              onClick={() => setPhase(1)}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={!ticker.trim()}
              icon="tabler:arrow-right"
              onClick={() => setPhase(3)}
            >
              View Verdict
            </Button>
          </div>
        </Card>
      )}

      {/* Phase 3: Verdict */}
      {phase === 3 && (
        <Card
          key="phase-3"
          className="min-h-[600px] animate-[fadeSlideIn_0.3s_ease-out] text-center"
        >
          <h2 className="mb-6 text-xl font-bold">Phase 3: The Verdict</h2>

          <div className="mb-6">
            <div className="text-bg-500 text-sm">Stock</div>
            <div className="text-2xl font-bold">
              {stockExchange.toUpperCase()}:{ticker.toUpperCase()}
            </div>
            {companyName && <div className="text-bg-500">{companyName}</div>}
          </div>

          <div className="mx-auto mb-6 grid max-w-md grid-cols-3 gap-4">
            <div
              className={`rounded-lg p-4 transition-colors ${
                scores.gdpScore >= 50
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }`}
            >
              <div className="text-sm font-medium">GDP</div>
              <div className="text-2xl font-bold">{scores.gdpScore}</div>
              <div className="text-xs font-bold uppercase">
                {scores.gdpScore >= 50 ? 'Pass' : 'Fail'}
              </div>
            </div>
            <div
              className={`rounded-lg p-4 transition-colors ${
                scores.prcScore >= 50
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }`}
            >
              <div className="text-sm font-medium">PRC</div>
              <div className="text-2xl font-bold">{scores.prcScore}</div>
              <div className="text-xs font-bold uppercase">
                {scores.prcScore >= 50 ? 'Pass' : 'Fail'}
              </div>
            </div>
            <div className="bg-bg-100 dark:bg-bg-800 rounded-lg p-4">
              <div className="text-bg-500 text-sm">Total</div>
              <div className="text-2xl font-bold">{scores.totalScore}</div>
              <div className="text-bg-400 text-xs font-medium">POINTS</div>
            </div>
          </div>

          <div
            className={`mx-auto mb-6 inline-flex items-center gap-3 rounded-xl border-2 px-6 py-4 ${VERDICTS[verdict].color}`}
          >
            <div className={`text-5xl font-black ${VERDICTS[verdict].color}`}>
              {verdict}
            </div>
            <div className="text-left">
              <div className={`text-lg font-bold ${VERDICTS[verdict].color}`}>
                Verdict: {VERDICTS[verdict].label}
              </div>
              <div className="text-bg-500 text-sm">
                {verdict === 'PASS' && 'Score >= 50 in both - Strong Candidate'}
                {verdict === 'NEUTRAL' && 'Mixed Results - Watch and Monitor'}
                {verdict === 'FAIL' && 'Does not meet criteria - Reject'}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              icon="tabler:arrow-left"
              variant="secondary"
              onClick={() => setPhase(2)}
            >
              Back to Edit
            </Button>
            <Button icon="tabler:device-floppy" onClick={handleSaveLog}>
              Save to Logbook
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  ConfirmationModal,
  ModuleHeader,
  useModalStore
} from 'lifeforge-ui'
import { useState } from 'react'

import { useAnalyzerStore } from '../store'
import {
  CASH_FLOW_OPTIONS,
  getVerdict,
  getVerdictBgColor,
  getVerdictColor,
  getVerdictLabel
} from '../types'

type TabType = 'analyses' | 'calculators'

export default function Logbook() {
  const [activeTab, setActiveTab] = useState<TabType>('analyses')

  const logs = useAnalyzerStore(s => s.logs)

  const calculatorLogs = useAnalyzerStore(s => s.calculatorLogs)

  const deleteLog = useAnalyzerStore(s => s.deleteLog)

  const deleteCalculatorLog = useAnalyzerStore(s => s.deleteCalculatorLog)

  const { open } = useModalStore()

  const hasNoLogs = logs.length === 0 && calculatorLogs.length === 0

  if (hasNoLogs) {
    return (
      <div className="flex h-full animate-[fadeSlideIn_0.3s_ease-out] flex-col">
        <ModuleHeader title="Analysis Logbook" />
        <div className="flex-center flex-1 flex-col gap-4">
          <Icon
            className="text-bg-300 dark:text-bg-600 size-20"
            icon="tabler:notebook"
          />
          <p className="text-bg-500">
            No saved logs yet. Complete an analysis or use a calculator to save
            results here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-[fadeSlideIn_0.3s_ease-out]">
      <ModuleHeader title="Analysis Logbook" />

      {/* Tabs */}
      <div className="border-bg-200 dark:border-bg-700 mb-4 flex gap-1 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'analyses'
              ? 'border-custom-500 text-custom-500 border-b-2'
              : 'text-bg-500 hover:text-bg-700'
          }`}
          type="button"
          onClick={() => setActiveTab('analyses')}
        >
          Stock Analyses ({logs.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'calculators'
              ? 'border-custom-500 text-custom-500 border-b-2'
              : 'text-bg-500 hover:text-bg-700'
          }`}
          type="button"
          onClick={() => setActiveTab('calculators')}
        >
          Calculations ({calculatorLogs.length})
        </button>
      </div>

      {/* Stock Analyses Tab */}
      {activeTab === 'analyses' && (
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-bg-500 py-8 text-center">
              No stock analyses saved yet.
            </div>
          ) : (
            <>
              <p className="text-bg-500">
                You have {logs.length} saved analysis
                {logs.length !== 1 ? 'es' : ''}.
              </p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {logs.map(log => {
                  const verdict = getVerdict(log.gdpScore, log.prcScore)

                  const cashFlowLabel =
                    CASH_FLOW_OPTIONS.find(o => o.value === log.cashFlowOption)
                      ?.label ?? log.cashFlowOption

                  return (
                    <Card key={log.id} className="flex flex-col">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <div className="text-lg font-bold">{log.ticker}</div>
                          {log.companyName && (
                            <div className="text-bg-500 text-sm">
                              {log.companyName}
                            </div>
                          )}
                          <div className="text-bg-500 mt-1 text-xs">
                            {new Date(log.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-bold ${getVerdictBgColor(verdict)} ${getVerdictColor(verdict)}`}
                        >
                          {verdict}
                          <span className="text-bg-500 text-xs font-normal">
                            ({log.totalScore})
                          </span>
                        </div>
                      </div>

                      <div className="mb-4 flex-1 space-y-3">
                        {/* Score Breakdown */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div
                            className={`rounded-lg p-2 ${
                              log.gdpScore >= 50
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            <div className="text-xs font-medium">GDP</div>
                            <div className="font-bold">{log.gdpScore}</div>
                          </div>
                          <div
                            className={`rounded-lg p-2 ${
                              log.prcScore >= 50
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            <div className="text-xs font-medium">PRC</div>
                            <div className="font-bold">{log.prcScore}</div>
                          </div>
                          <div className="bg-bg-100 dark:bg-bg-800 rounded-lg p-2">
                            <div className="text-bg-500 text-xs">Total</div>
                            <div className="font-bold">{log.totalScore}</div>
                          </div>
                        </div>

                        {/* Metrics Summary */}
                        <div className="text-bg-500 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>CAGR</span>
                            <span>{log.cagrValue.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>D/Y</span>
                            <span>{log.dyValue.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PE</span>
                            <span>{log.peValue.toFixed(1)}x</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Margin</span>
                            <span>{log.marginValue.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ROE</span>
                            <span>{log.roeValue.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cash Flow</span>
                            <span>{cashFlowLabel}</span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          {log.passedZulu && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-green-500/50 bg-green-500/10 px-2 py-0.5 text-xs text-green-500">
                              <Icon className="size-3" icon="tabler:check" />
                              Zulu Pass
                            </span>
                          )}
                          {log.undervaluedPe && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-green-500/50 bg-green-500/10 px-2 py-0.5 text-xs text-green-500">
                              <Icon className="size-3" icon="tabler:check" />
                              Undervalued
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${getVerdictBgColor(verdict)} ${getVerdictColor(verdict)}`}
                          >
                            {getVerdictLabel(verdict)}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        icon="tabler:trash"
                        variant="secondary"
                        onClick={() => {
                          open(ConfirmationModal, {
                            title: 'Delete Analysis',
                            description: `Are you sure you want to delete the analysis for ${log.ticker}?`,
                            confirmButtonText: 'Delete',
                            onConfirm: async () => deleteLog(log.id)
                          })
                        }}
                      >
                        Delete
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Calculator Logs Tab */}
      {activeTab === 'calculators' && (
        <div className="space-y-4">
          {calculatorLogs.length === 0 ? (
            <div className="text-bg-500 py-8 text-center">
              No calculator logs saved yet. Use the Toolbox calculators and
              click &quot;Save All Calculations&quot;.
            </div>
          ) : (
            <>
              <p className="text-bg-500">
                You have {calculatorLogs.length} saved calculation
                {calculatorLogs.length !== 1 ? 's' : ''}.
              </p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {calculatorLogs.map(log => (
                  <Card key={log.id} className="flex flex-col">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <div className="text-lg font-bold">{log.ticker}</div>
                        {log.name && (
                          <div className="text-bg-500 text-sm">{log.name}</div>
                        )}
                        {log.exchange && (
                          <div className="text-custom-500 text-xs">
                            {log.exchange}
                          </div>
                        )}
                        <div className="text-bg-500 mt-1 text-xs">
                          {new Date(log.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Calculator values */}
                    <div className="text-bg-500 mb-4 flex-1 space-y-1 text-sm">
                      {log.cagr !== undefined && (
                        <div className="flex justify-between">
                          <span>CAGR</span>
                          <span>{log.cagr.toFixed(2)}%</span>
                        </div>
                      )}
                      {log.dy !== undefined && (
                        <div className="flex justify-between">
                          <span>Dividend Yield</span>
                          <span>{log.dy.toFixed(2)}%</span>
                        </div>
                      )}
                      {log.pe !== undefined && (
                        <div className="flex justify-between">
                          <span>P/E Ratio</span>
                          <span>{log.pe.toFixed(2)}x</span>
                        </div>
                      )}
                      {log.margin !== undefined && (
                        <div className="flex justify-between">
                          <span>Profit Margin</span>
                          <span>{log.margin.toFixed(2)}%</span>
                        </div>
                      )}
                      {log.roe !== undefined && (
                        <div className="flex justify-between">
                          <span>ROE</span>
                          <span>{log.roe.toFixed(2)}%</span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      icon="tabler:trash"
                      variant="secondary"
                      onClick={() => {
                        open(ConfirmationModal, {
                          title: 'Delete Calculation',
                          description: `Are you sure you want to delete this calculation for ${log.ticker}?`,
                          confirmButtonText: 'Delete',
                          onConfirm: async () => deleteCalculatorLog(log.id)
                        })
                      }}
                    >
                      Delete
                    </Button>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

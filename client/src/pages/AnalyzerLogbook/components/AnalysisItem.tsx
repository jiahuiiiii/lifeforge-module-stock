import dayjs from 'dayjs'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  TagChip,
  useModalStore
} from 'lifeforge-ui'
import COLORS from 'tailwindcss/colors'

import { useAnalyzerStore } from '../../Analyzer/store'
import {
  CASH_FLOW_OPTIONS,
  type StockLog,
  VERDICTS,
  getVerdict
} from '../../Analyzer/types'

function AnalysisItem({ log }: { log: StockLog }) {
  const { open } = useModalStore()

  const deleteLog = useAnalyzerStore(s => s.deleteLog)

  const verdict = getVerdict(log.gdpScore, log.prcScore)

  const cashFlowLabel =
    CASH_FLOW_OPTIONS.find(o => o.value === log.cashFlowOption)?.label ??
    log.cashFlowOption

  return (
    <Card className="flex flex-col">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-xl font-semibold">{log.ticker}</div>
          {log.companyName && (
            <div className="text-custom-500">{log.companyName}</div>
          )}
          <div className="text-bg-500 mt-1 text-sm">
            {dayjs(log.date).format('DD MMM YYYY')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TagChip
            className="text-xs!"
            color={VERDICTS[verdict].color}
            icon={VERDICTS[verdict].icon}
            label={`${verdict} (${log.totalScore})`}
          />
          <ContextMenu
            classNames={{
              button: 'p-2!'
            }}
          >
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="Delete"
              onClick={() => {
                open(ConfirmationModal, {
                  title: 'Delete Analysis',
                  description: `Are you sure you want to delete this analysis for ${log.ticker}?`,
                  confirmButtonText: 'Delete',
                  onConfirm: async () => deleteLog(log.id)
                })
              }}
            />
          </ContextMenu>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div
            className={`rounded-lg p-2 ${
              log.gdpScore >= 50
                ? 'bg-green-500/10 text-green-500'
                : 'bg-red-500/10 text-red-500'
            }`}
          >
            <div className="text-sm font-medium">GDP</div>
            <div className="text-lg font-semibold">{log.gdpScore}</div>
          </div>
          <div
            className={`rounded-lg p-2 ${
              log.prcScore >= 50
                ? 'bg-green-500/10 text-green-500'
                : 'bg-red-500/10 text-red-500'
            }`}
          >
            <div className="text-sm font-medium">PRC</div>
            <div className="text-lg font-semibold">{log.prcScore}</div>
          </div>
          <div className="bg-bg-100 dark:bg-bg-800 rounded-lg p-2">
            <div className="text-bg-500 text-sm">Total</div>
            <div className="text-lg font-semibold">{log.totalScore}</div>
          </div>
        </div>

        <div className="space-y-1">
          {Object.entries({
            CAGR: `${log.cagrValue.toFixed(1)}%`,
            'D/Y': `${log.dyValue.toFixed(1)}%`,
            PE: `${log.peValue.toFixed(1)}x`,
            Margin: `${log.marginValue.toFixed(1)}%`,
            ROE: `${log.roeValue.toFixed(1)}%`,
            'Cash Flow': cashFlowLabel
          }).map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-bg-500">{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {log.passedZulu && (
            <TagChip
              color={COLORS.green[500]}
              icon="tabler:check"
              label="Zulu Pass"
            />
          )}
          {log.undervaluedPe && (
            <TagChip
              color={COLORS.green[500]}
              icon="tabler:check"
              label="Undervalued"
            />
          )}
          <TagChip
            color={VERDICTS[verdict].color}
            icon={VERDICTS[verdict].icon}
            label={VERDICTS[verdict].label}
          />
        </div>
      </div>
    </Card>
  )
}

export default AnalysisItem

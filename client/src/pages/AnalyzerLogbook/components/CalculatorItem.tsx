import dayjs from 'dayjs'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  TagChip,
  useModalStore
} from 'lifeforge-ui'

import { useAnalyzerStore } from '../store'
import type { CalculatorLog } from '../types'

function CalculatorItem({ log }: { log: CalculatorLog }) {
  const { open } = useModalStore()

  const deleteCalculatorLog = useAnalyzerStore(s => s.deleteCalculatorLog)

  return (
    <Card className="flex flex-col">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-xl font-semibold">{log.ticker}</div>
          {log.name && <div className="text-custom-500">{log.name}</div>}

          <div className="text-bg-500 mt-2 text-xs">
            {dayjs(log.date).format('YYYY-MM-DD')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {log.exchange && <TagChip className="text-xs" label={log.exchange} />}
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
                  title: 'Delete Calculation',
                  description: `Are you sure you want to delete this calculation for ${log.ticker}?`,
                  confirmButtonText: 'Delete',
                  onConfirm: async () => deleteCalculatorLog(log.id)
                })
              }}
            />
          </ContextMenu>
        </div>
      </div>
      <div className="space-y-1">
        {(
          [
            { key: 'cagr', label: 'CAGR', suffix: '%' },
            { key: 'dy', label: 'Dividend Yield', suffix: '%' },
            { key: 'pe', label: 'P/E Ratio', suffix: 'x' },
            { key: 'margin', label: 'Profit Margin', suffix: '%' },
            { key: 'roe', label: 'ROE', suffix: '%' }
          ] as const
        ).map(({ key, label, suffix }) => (
          <div key={key} className="flex justify-between">
            <span className="text-bg-500">{label}</span>
            {log[key] ? (
              <span>
                {log[key]!.toFixed(2)}
                {suffix}
              </span>
            ) : (
              <span className="text-bg-400 dark:text-bg-600">N/A</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default CalculatorItem

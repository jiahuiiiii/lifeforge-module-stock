/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmptyStateScreen } from 'lifeforge-ui'
import React from 'react'

import type { CalculatorLog, StockLog } from '../types'

function ItemListing({
  logs,
  component
}: {
  logs: StockLog[] | CalculatorLog[]
  component: React.FC<{ log: any }>
}) {
  const Component = component

  if (logs.length === 0)
    return (
      <div className="flex-1">
        <EmptyStateScreen
          icon="tabler:book-off"
          message={{
            id: 'savedAnalysisLog',
            namespace: 'apps.jiahuiiiii$stock'
          }}
        />
      </div>
    )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {logs.map(log => (
        <Component key={log.id} log={log} />
      ))}
    </div>
  )
}

export default ItemListing

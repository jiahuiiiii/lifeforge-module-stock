import type { ComponentType } from 'react'

import { EmptyStateScreen, Grid } from '@lifeforge/ui'

function ItemListing<T extends { id: string }>({
  emptyStateId,
  logs,
  component: Component
}: {
  emptyStateId: string
  logs: T[]
  component: ComponentType<{ log: T }>
}) {
  if (logs.length === 0) {
    return <EmptyStateScreen icon="tabler:book-off" message={{ id: emptyStateId }} />
  }

  return (
    <Grid gap="md" templateCols={{ base: 1, md: 2, lg: 3 }}>
      {logs.map(log => (
        <Component key={log.id} log={log} />
      ))}
    </Grid>
  )
}

export default ItemListing

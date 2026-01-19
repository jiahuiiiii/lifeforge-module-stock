import { Card, TagChip } from 'lifeforge-ui'
import { type InferOutput, Link } from 'shared'

import type forgeAPI from '@/utils/forgeAPI'

import type { WatchlistItem } from '../index'

type BestMatch = InferOutput<typeof forgeAPI.search>['bestMatches'][number]

function SearchResultItem({ match }: { match: BestMatch }) {
  return (
    <Card
      key={match['1. symbol']}
      isInteractive
      as={Link}
      className="flex-between"
      to={`./chart/${match['1. symbol']}||${match['2. name']}`}
    >
      <div>
        <div>
          <div className="text-custom-500 text-sm">{match['1. symbol']}</div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-medium">{match['2. name']}</div>
            {JSON.parse(localStorage.getItem('stock_watchlist') || '[]').some(
              (item: WatchlistItem) => item.symbol === match['1. symbol']
            ) && (
              <span className="iconify tabler--star-filled text-yellow-500" />
            )}
          </div>
        </div>
        <div className="text-bg-500 text-sm">{match['4. region']}</div>
      </div>
      <TagChip label={match['3. type']} />
    </Card>
  )
}

export default SearchResultItem

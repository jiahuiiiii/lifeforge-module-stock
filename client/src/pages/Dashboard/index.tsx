import { useQuery } from '@tanstack/react-query'
import {
  EmptyStateScreen,
  ModuleHeader,
  SearchInput,
  WithQuery
} from 'lifeforge-ui'
import { useState } from 'react'

import forgeAPI from '@/utils/forgeAPI'

import SearchResultItem from './components/SearchResultItem'

export interface WatchlistItem {
  symbol: string
  name: string
  addedAt: string
}

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')

  const searchResultQuery = useQuery(
    forgeAPI.search
      .input({
        keywords: searchQuery
      })
      .queryOptions({
        queryKey: ['search-stocks', searchQuery],
        enabled: searchQuery.trim().length > 0
      })
  )

  return (
    <div className="flex size-full flex-1 animate-[fadeSlideIn_0.3s_ease-out] flex-col">
      <ModuleHeader />
      <SearchInput
        debounceMs={300}
        searchTarget="stocks"
        showChildrenPolicy="query-not-empty"
        value={searchQuery}
        onChange={setSearchQuery}
      >
        <WithQuery loaderSize="2rem" query={searchResultQuery}>
          {results => (
            <>
              {results.bestMatches?.length === 0 ? (
                <div className="text-bg-500 text-center">
                  No suggestions found.
                </div>
              ) : (
                <div className="max-h-[30vh] w-full space-y-2 overflow-y-auto">
                  {results.bestMatches?.map(match => (
                    <SearchResultItem key={match['1. symbol']} match={match} />
                  ))}
                </div>
              )}
            </>
          )}
        </WithQuery>
      </SearchInput>
      <div className="flex-center flex-1">
        <EmptyStateScreen
          icon="material-symbols-light:candlestick-chart"
          message={{
            id: 'stock',
            namespace: 'apps.jiahuiiiii$stock'
          }}
        />
      </div>
    </div>
  )
}

export default Dashboard

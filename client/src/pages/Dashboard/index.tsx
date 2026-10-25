import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  EmptyStateScreen,
  Flex,
  ModuleHeader,
  SearchInput,
  Text,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import SearchResultItem from './components/SearchResultItem'

export interface WatchlistItem {
  symbol: string
  name: string
  addedAt: string
}

function Dashboard() {
  const { t } = useModuleTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const searchResultQuery = useQuery(
    forgeAPI.data.search
      .input({ keywords: searchQuery })
      .queryOptions({
        enabled: searchQuery.trim().length > 0
      })
  )

  return (
    <Flex direction="column" flex="1" height="100%" width="100%">
      <ModuleHeader />
      <SearchInput
        debounceMs={300}
        searchTarget="stocks"
        showChildrenPolicy="query-not-empty"
        value={searchQuery}
        onChange={setSearchQuery}
      >
        <WithQuery loaderSize="2rem" query={searchResultQuery}>
          {results =>
            results.results.length === 0 ? (
              <Text align="center" color="muted">
                {t('empty.search.title')}
              </Text>
            ) : (
              <Flex
                direction="column"
                gap="sm"
                maxHeight="30vh"
                overflowY="auto"
                width="100%"
              >
                {results.results.map(match => (
                  <SearchResultItem key={match.symbol} match={match} />
                ))}
              </Flex>
            )
          }
        </WithQuery>
      </SearchInput>
      <Flex align="center" flex="1" justify="center">
        <EmptyStateScreen icon="material-symbols-light:candlestick-chart" message={{ id: 'stock' }} />
      </Flex>
    </Flex>
  )
}

export default Dashboard

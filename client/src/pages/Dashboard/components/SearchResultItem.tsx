import { Link } from 'react-router'

import type { InferOutput } from '@lifeforge/api'
import { Card, Flex, Icon, Stack, TagChip, Text, surface } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

type SearchResult = InferOutput<typeof forgeAPI.data.search>['results'][number]

function SearchResultItem({ match }: { match: SearchResult }) {
  const isInWatchlist = (
    JSON.parse(localStorage.getItem('stock_watchlist') ?? '[]') as {
      symbol: string
    }[]
  ).some(item => item.symbol === match.symbol)

  return (
    <Card
      isInteractive
      align="center"
      as={Link}
      bg={surface.lightInteractive}
      direction="row"
      gap="md"
      justify="between"
      to={`chart/${match.symbol}||${match.name}`}
    >
      <Stack gap="xs" minWidth="0">
        <Text color="primary" size="sm" weight="medium">
          {match.symbol}
        </Text>
        <Flex align="center" gap="sm">
          <Text truncate size="lg" weight="medium">
            {match.name}
          </Text>
          {isInWatchlist && (
            <Icon color="yellow-500" icon="tabler:star-filled" />
          )}
        </Flex>
        <Text color="muted" size="sm">
          {match.region}
        </Text>
      </Stack>
      <TagChip flexShrink="0" label={match.type} />
    </Card>
  )
}

export default SearchResultItem

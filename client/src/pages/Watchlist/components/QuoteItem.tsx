import { Link } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Bordered,
  Box,
  COLORS,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  LoadingScreen,
  Stack,
  TagChip,
  Text,
  colorWithOpacity,
  useModalStore
} from '@lifeforge/ui'

import type { WatchlistItem } from '@/pages/Dashboard'

import type { Quote } from '..'

function QuoteItem({
  item,
  quote,
  removeFromWatchlist
}: {
  item: WatchlistItem
  quote: Quote | 'error' | undefined
  removeFromWatchlist: (symbol: string) => void
}) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const isPositive =
    quote === 'error' ? false : quote ? quote.change >= 0 : false

  const isLoading = quote === undefined

  function handleRemove() {
    open(ConfirmationModal, {
      title: t('modals.watchlist.remove'),
      description: t('modals.watchlist.removeConfirmation', {
        symbol: item.symbol
      }),
      confirmationButton: 'delete',
      onConfirm: () => {
        removeFromWatchlist(item.symbol)
      }
    })
  }

  return (
    <Card
      isInteractive
      as={Link}
      gap="md"
      overflow="hidden"
      position="relative"
      style={{ paddingLeft: 'calc(var(--spacing) * 10)' }}
      to={`../chart/${item.symbol}||${item.name}`}
    >
      {!isLoading && quote !== 'error' && (
        <Box
          bg={isPositive ? 'green-500' : 'red-500'}
          bottom="calc(var(--spacing) * 4)"
          left="calc(var(--spacing) * 4)"
          position="absolute"
          r="full"
          top="calc(var(--spacing) * 4)"
          width="0.4em"
        />
      )}
      <Flex align="start" gap="sm" justify="between">
        <Stack gap="xs" minWidth="0">
          <Text size="xl" weight="semibold">
            {item.symbol}
          </Text>
          <Text truncate color="muted" size="sm">
            {item.name}
          </Text>
        </Stack>
        <ContextMenu
          componentProps={{
            button: {
              p: 'sm'
            }
          }}
        >
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="removeFromWatchlist"
            onClick={handleRemove}
          />
        </ContextMenu>
      </Flex>

      {quote === 'error' ? (
        <Flex
          align="center"
          bg={colorWithOpacity('red-500', '10%')}
          gap="sm"
          p="sm"
          r="md"
        >
          <Icon color="red-500" icon="tabler:alert-circle" />
          <Text color="red-500" size="sm">
            {t('watchlist.fetchFailed')}
          </Text>
        </Flex>
      ) : quote ? (
        <Flex align="end" justify="between">
          <Text size="3xl" weight="semibold">
            ${quote.price.toFixed(2)}
          </Text>
          <TagChip
            color={isPositive ? COLORS['green-500'] : COLORS['red-500']}
            icon={isPositive ? 'tabler:trending-up' : 'tabler:trending-down'}
            label={`${isPositive ? '+' : ''}${quote.change_percent.toFixed(2)}%`}
            size="sm"
          />
        </Flex>
      ) : (
        <Flex align="center" height="4em" justify="center">
          <LoadingScreen loaderSize="1.5rem" />
        </Flex>
      )}

      {quote && quote !== 'error' && (
        <Bordered
          borderColor={isPositive ? 'green-500' : 'red-500'}
          borderSide="top"
          pt="sm"
        >
          <Text color={isPositive ? 'green-500' : 'red-500'} size="sm">
            {t('watchlist.changeToday', {
              amount: `${isPositive ? '+' : ''}$${quote.change.toFixed(2)}`
            })}
          </Text>
        </Bordered>
      )}
    </Card>
  )
}

export default QuoteItem

import dayjs from 'dayjs'
import { Link } from 'react-router'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  COLORS,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Stack,
  TagChip,
  Text,
  surface,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { HoldingWithPrice } from './HoldingsTable'
import ModifyHoldingModal from './ModifyHoldingModal'

function HoldingRow({
  holding,
  isLoading
}: {
  holding: HoldingWithPrice
  isLoading: boolean
}) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const removeHoldingMutation = useForgeMutation(
    forgeAPI.portfolios.holdings.remove.input({ id: holding.id }),
    {
      action: 'delete',
      queryKey: forgeAPI.portfolios.key
    }
  )

  const marketValue = holding.shares * holding.currentPrice

  const costBasis = holding.shares * holding.avg_cost

  const profitLoss = marketValue - costBasis

  const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0

  const isPositive = profitLoss >= 0

  function handleEdit() {
    open(ModifyHoldingModal, {
      initialData: holding,
      openType: 'update'
    })
  }

  function handleRemove() {
    open(ConfirmationModal, {
      title: t('modals.holding.remove'),
      description: t('modals.holding.removeConfirmation', {
        symbol: holding.symbol
      }),
      confirmationButton: 'delete',
      onConfirm: async () => {
        await removeHoldingMutation.mutateAsync(undefined)
      }
    })
  }

  return (
    <Card align="center" bg={surface.light} direction="row">
      <Stack gap="xs" minWidth="0">
        <Text asChild size="lg" weight="semibold">
          <Link to={`../../chart/${holding.symbol}||${holding.name}`}>
            {holding.symbol}
          </Link>
        </Text>
        <Text truncate color="muted" size="sm">
          {holding.name}
        </Text>
        <Text color="muted" size="sm">
          {t('holding.sharesAt', {
            shares: holding.shares.toLocaleString(),
            cost: holding.avg_cost.toFixed(2)
          })}
        </Text>
        <Text color="muted" size="sm">
          {dayjs(holding.date_added).format('DD MMM YYYY')}
        </Text>
      </Stack>
      <Stack gap="xs">
        <Text align="right" size="lg" weight="semibold">
          ${' '}
          {marketValue.toLocaleString('en-US', {
            minimumFractionDigits: 2
          })}
        </Text>
        {isLoading ? (
          <Text color="muted" size="sm">
            {t('common.loading')}
          </Text>
        ) : (
          <>
            <Flex align="center" gap="sm" justify="end">
              <Text
                color={holding.change >= 0 ? 'green-500' : 'red-500'}
                size="sm"
              >
                ${holding.currentPrice.toFixed(2)}
              </Text>
              <TagChip
                color={
                  holding.change >= 0 ? COLORS['green-500'] : COLORS['red-500']
                }
                label={`${holding.change >= 0 ? '+' : ''}${holding.changePercent.toFixed(2)}%`}
                size="sm"
              />
            </Flex>
            <Text
              align="right"
              color={isPositive ? 'green-500' : 'red-500'}
              size="sm"
            >
              {isPositive ? '+' : ''}${profitLoss.toFixed(2)} (
              {profitLossPercent.toFixed(2)}%)
            </Text>
          </>
        )}
      </Stack>
      <ContextMenu ml="lg">
        <ContextMenuItem
          icon="tabler:pencil"
          label="edit"
          onClick={handleEdit}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="delete"
          onClick={handleRemove}
        />
      </ContextMenu>
    </Card>
  )
}

export default HoldingRow

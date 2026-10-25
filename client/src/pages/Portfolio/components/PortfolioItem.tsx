import { Link } from 'react-router'

import { type InferOutput, useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Stack,
  Text,
  colorWithOpacity,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import numberToCurrency from '@/utils/numberToCurrency'

import ModifyPortfolioModal from './ModifyPortfolioModal'

export type PortfolioListingItem = InferOutput<
  typeof forgeAPI.portfolios.list
>[number]

function PortfolioItem({ portfolio }: { portfolio: PortfolioListingItem }) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const deletePortfolioMutation = useForgeMutation(
    forgeAPI.portfolios.remove.input({ id: portfolio.id }),
    {
      action: 'delete',
      queryKey: forgeAPI.portfolios.key
    }
  )

  function handleUpdate() {
    open(ModifyPortfolioModal, {
      initialData: portfolio,
      openType: 'update'
    })
  }

  function handleDelete() {
    open(ConfirmationModal, {
      title: t('modals.portfolio.delete'),
      description: t('modals.portfolio.deleteConfirmation', {
        name: portfolio.name
      }),
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deletePortfolioMutation.mutateAsync(undefined)
      }
    })
  }

  return (
    <Card
      isInteractive
      align="center"
      as={Link}
      direction="row"
      gap="md"
      justify="between"
      to={portfolio.id}
    >
      <Flex align="center" gap="md" minWidth="0">
        <Flex
          align="center"
          bg={colorWithOpacity('custom-500', '10%')}
          flexShrink="0"
          height="3.5em"
          justify="center"
          r="md"
          width="3.5em"
        >
          <Icon color="primary" icon="tabler:briefcase" size="1.75em" />
        </Flex>
        <Stack gap="xs" minWidth="0">
          <Text size="xl" weight="medium">
            {portfolio.name}
          </Text>
          <Text color="muted">
            {t('portfolio.holdingsCount', {
              count: portfolio.holding_count
            })}
          </Text>
        </Stack>
      </Flex>
      <Flex align="center" gap="md">
        <Text size="xl">${numberToCurrency(portfolio.latest_value)}</Text>
        <ContextMenu>
          <ContextMenuItem
            icon="tabler:pencil"
            label="edit"
            onClick={handleUpdate}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="delete"
            onClick={handleDelete}
          />
        </ContextMenu>
      </Flex>
    </Card>
  )
}

export default PortfolioItem

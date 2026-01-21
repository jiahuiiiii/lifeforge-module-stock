import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { type InferOutput, Link, useModalStore } from 'shared'

import forgeAPI from '@/utils/forgeAPI'
import numberToCurrency from '@/utils/numberToCurrency'

import ModifyPortfolioModal from './ModifyPortfolioModal'

export type PortfolioListingItem = InferOutput<
  typeof forgeAPI.portfolios.list
>[number]

function PortfolioItem({ portfolio }: { portfolio: PortfolioListingItem }) {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const queryClient = useQueryClient()

  const { open } = useModalStore()

  const deletePortfolioMutation = useMutation(
    forgeAPI.portfolios.remove.input({ id: portfolio.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['jiahuiiiii--stock', 'portfolios']
        })
      },
      onError: () => {
        toast.error(t('errors.portfolio.deleteFailed'))
      }
    })
  )

  const handleUpdate = () => {
    open(ModifyPortfolioModal, {
      initialData: portfolio,
      openType: 'update'
    })
  }

  const handleDelete = () => {
    open(ConfirmationModal, {
      title: t('modals.portfolio.delete'),
      description: t('modals.portfolio.deleteConfirmation', {
        name: portfolio.name
      }),
      confirmationButton: 'delete',
      onConfirm: async () => {
        deletePortfolioMutation.mutateAsync({})
      }
    })
  }

  return (
    <Card
      isInteractive
      as={Link}
      className="flex-between gap-3"
      to={`./${portfolio.id}`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-custom-500/10 flex-center size-14 rounded-md">
          <Icon className="text-custom-500 size-7" icon="tabler:briefcase" />
        </div>
        <div>
          <h3 className="text-xl font-medium">{portfolio.name}</h3>
          <p className="text-bg-500">
            {t('portfolio.holdingsCount', { count: portfolio.holdingCount })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xl">${numberToCurrency(portfolio.latestValue)}</p>
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
      </div>
    </Card>
  )
}

export default PortfolioItem

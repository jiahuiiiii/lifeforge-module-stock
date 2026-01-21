import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { useParams } from 'shared'
import z from 'zod'

import forgeAPI from '@/utils/forgeAPI'

import type { HoldingEntry } from '..'
import { type Holding } from '../../Portfolio'

function ModifyHoldingModal({
  onClose,
  data: { initialData, openType }
}: {
  onClose: () => void
  data: {
    initialData?: HoldingEntry
    openType: 'create' | 'update'
  }
}) {
  const { portfolioId } = useParams()

  const queryClient = useQueryClient()

  const mutation = useMutation(
    (openType === 'create'
      ? forgeAPI.portfolios.holdings.create.input({
          portfolioId: portfolioId || ''
        })
      : forgeAPI.portfolios.holdings.update.input({ id: initialData?.id || '' })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['jiahuiiiii--stock', 'portfolios']
        })
      },
      onError: () => {
        toast.error(`Failed to ${openType} holding`)
      }
    })
  )

  const { formProps } = defineForm<Holding>({
    title: `holding.${openType}`,
    icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
    onClose,
    namespace: 'apps.jiahuiiiii$stock',
    submitButton: openType
  })
    .typesMap({
      symbol: 'text',
      name: 'text',
      shares: 'number',
      avgCost: 'number',
      dateAdded: 'datetime'
    })
    .setupFields({
      symbol: {
        icon: 'tabler:ticket',
        label: 'Symbol',
        placeholder: 'AAPL',
        required: true,
        disabled: openType === 'update'
      },
      name: {
        icon: 'tabler:briefcase',
        label: 'Company Name',
        placeholder: 'Apple',
        disabled: openType === 'update'
      },
      shares: {
        icon: 'tabler:hash',
        label: 'Shares',
        placeholder: '100',
        required: true,
        validator: z.number().min(1)
      },
      avgCost: {
        icon: 'tabler:currency-dollar',
        label: 'Avg Cost',
        placeholder: '100',
        required: true,
        validator: z.number().min(1)
      },
      dateAdded: {
        icon: 'tabler:calendar',
        label: 'Date Added',
        placeholder: '2022-01-01',
        required: true
      }
    })
    .initialData({
      ...initialData,
      dateAdded: initialData?.dateAdded
        ? dayjs(initialData.dateAdded).toDate()
        : dayjs().toDate()
    })
    .onSubmit(async data => {
      mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyHoldingModal

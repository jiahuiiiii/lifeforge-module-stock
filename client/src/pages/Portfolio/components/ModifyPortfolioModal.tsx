import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import type { PortfolioListingItem } from './PortfolioItem'

function ModifyPortfolioModal({
  onClose,
  data: { initialData, openType }
}: {
  onClose: () => void
  data: {
    initialData?: PortfolioListingItem
    openType: 'create' | 'update'
  }
}) {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const queryClient = useQueryClient()

  const mutation = useMutation(
    (openType === 'create'
      ? forgeAPI.portfolios.create
      : forgeAPI.portfolios.update.input({ id: initialData?.id || '' })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['jiahuiiiii--stock', 'portfolios']
        })
      },
      onError: () => {
        toast.error(
          t(
            openType === 'create'
              ? 'errors.portfolio.createFailed'
              : 'errors.portfolio.renameFailed'
          )
        )
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<typeof forgeAPI.portfolios.create>['body']
  >({
    icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `portfolio.${openType}`,
    onClose,
    submitButton: openType,
    namespace: 'apps.jiahuiiiii$stock'
  })
    .typesMap({
      name: 'text',
      closingTime: 'datetime'
    })
    .setupFields({
      name: {
        icon: 'tabler:briefcase',
        label: 'portfolio Name',
        placeholder: t('placeholders.portfolioName'),
        required: true
      },
      closingTime: {
        icon: 'tabler:clock',
        label: 'closingTime',
        required: true,
        hasTime: true
      }
    })
    .initialData(initialData)
    .autoFocusField('name')
    .onSubmit(async data => {
      mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyPortfolioModal

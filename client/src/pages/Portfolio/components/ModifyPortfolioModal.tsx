import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import { DateField, FormModal, TextField } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { PortfolioListingItem } from './PortfolioItem'

const schema = z.object({
  name: z.string().min(1),
  closing_time: z.date()
})

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
  const { t } = useModuleTranslation()

  const createMutation = useForgeMutation(forgeAPI.portfolios.create, {
    action: 'create',
    queryKey: forgeAPI.portfolios.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.portfolios.update.input({ id: initialData?.id ?? '' }),
    {
      action: 'update',
      queryKey: forgeAPI.portfolios.key
    }
  )

  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? '',
      closing_time: initialData?.closing_time
        ? dayjs(initialData.closing_time).toDate()
        : dayjs().toDate()
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: openType,
        handler: async (data: z.infer<typeof schema>) => {
          const payload = {
            name: data.name,
            closing_time: data.closing_time.toISOString()
          }

          await (
            openType === 'create' ? createMutation : updateMutation
          ).mutateAsync(payload)
        }
      }}
      uiConfig={{
        icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `modals.portfolio.${openType}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:briefcase"
        label="portfolioName"
        name="name"
        placeholder={t('placeholders.portfolioName')}
      />
      <DateField
        hasTime
        required
        control={form.control}
        icon="tabler:clock"
        label="closingTime"
        name="closing_time"
      />
    </FormModal>
  )
}

export default ModifyPortfolioModal

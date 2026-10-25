import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  DateField,
  FormModal,
  NumberField,
  TextField
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { HoldingEntry } from '..'

const schema = z.object({
  symbol: z.string().min(1),
  name: z.string(),
  shares: z.number().min(1),
  avg_cost: z.number().min(0),
  date_added: z.date()
})

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
  const { t } = useModuleTranslation()
  const { portfolioId } = useParams()

  const createMutation = useForgeMutation(
    forgeAPI.portfolios.holdings.create.input({
      portfolioId: portfolioId ?? ''
    }),
    {
      action: 'create',
      queryKey: forgeAPI.portfolios.key
    }
  )

  const updateMutation = useForgeMutation(
    forgeAPI.portfolios.holdings.update.input({ id: initialData?.id ?? '' }),
    {
      action: 'update',
      queryKey: forgeAPI.portfolios.key
    }
  )

  const form = useForm({
    defaultValues: {
      symbol: initialData?.symbol ?? '',
      name: initialData?.name ?? '',
      shares: initialData?.shares ?? 1,
      avg_cost: initialData?.avg_cost ?? 0,
      date_added: initialData?.date_added
        ? dayjs(initialData.date_added).toDate()
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
          const shared = {
            shares: data.shares,
            avg_cost: data.avg_cost,
            date_added: data.date_added.toISOString()
          }

          if (openType === 'create') {
            await createMutation.mutateAsync({
              ...shared,
              symbol: data.symbol,
              name: data.name
            })

            return
          }

          await updateMutation.mutateAsync(shared)
        }
      }}
      uiConfig={{
        icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `modals.holding.${openType}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        disabled={openType === 'update'}
        icon="tabler:ticket"
        label="symbol"
        name="symbol"
        placeholder={t('placeholders.symbol')}
      />
      <TextField
        control={form.control}
        disabled={openType === 'update'}
        icon="tabler:briefcase"
        label="companyName"
        name="name"
        placeholder={t('placeholders.companyName')}
      />
      <NumberField
        required
        control={form.control}
        icon="tabler:hash"
        label="shares"
        min={1}
        name="shares"
      />
      <NumberField
        required
        control={form.control}
        icon="tabler:currency-dollar"
        label="avgCost"
        min={0}
        name="avg_cost"
      />
      <DateField
        required
        control={form.control}
        icon="tabler:calendar"
        label="dateAdded"
        name="date_added"
      />
    </FormModal>
  )
}

export default ModifyHoldingModal

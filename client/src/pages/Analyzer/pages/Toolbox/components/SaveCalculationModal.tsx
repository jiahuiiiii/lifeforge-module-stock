import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import { DateField, FormModal, TextField } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  ticker: z.string().min(1),
  name: z.string(),
  exchange: z.string(),
  date: z.date()
})

export default function SaveCalculationModal({
  onClose,
  data: { results }
}: {
  onClose: () => void
  data: {
    results: {
      values_and_scores: Record<
        string,
        {
          value: number | undefined
          score: number
        }
      >
      total_score: number
    }
  }
}) {
  const { t } = useModuleTranslation()

  const createMutation = useForgeMutation(
    forgeAPI.analyzer.logs.calculator.create,
    {
      action: 'create',
      queryKey: forgeAPI.analyzer.logs.calculator.key
    }
  )

  const form = useForm({
    defaultValues: {
      ticker: '',
      name: '',
      exchange: '',
      date: dayjs().toDate()
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        label: 'Save',
        icon: 'tabler:device-floppy',
        handler: async (data: z.infer<typeof schema>) => {
          await createMutation.mutateAsync({
            ticker: data.ticker,
            name: data.name,
            exchange: data.exchange,
            date: data.date.toISOString(),
            values_and_scores: results.values_and_scores,
            total_score: results.total_score
          })
        }
      }}
      uiConfig={{
        icon: 'tabler:device-floppy',
        title: t('modals.saveCalculation'),
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:currency-dollar"
        label="stockTicker"
        name="ticker"
        placeholder={t('placeholders.symbol')}
      />
      <TextField
        control={form.control}
        icon="tabler:building"
        label="companyName"
        name="name"
        placeholder={t('placeholders.companyName')}
      />
      <TextField
        control={form.control}
        icon="tabler:status-change"
        label="stockExchange"
        name="exchange"
        placeholder="e.g., NASDAQ"
      />
      <DateField
        required
        control={form.control}
        icon="tabler:calendar"
        label="date"
        name="date"
      />
    </FormModal>
  )
}

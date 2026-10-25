import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  DateField,
  FileField,
  FormModal,
  ListboxField,
  TextAreaField,
  TextField,
  convertFormFileFieldData,
  fileValueSchema,
  getFormFileFieldInitialData
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { DiaryEntry } from '..'
import { MOOD_CONFIG } from '../constants'

const schema = z.object({
  date: z.date(),
  feel: z.enum(['bullish', 'neutral', 'bearish', 'anxious', 'excited']),
  title: z.string().min(1),
  notes: z.string(),
  image: fileValueSchema
})

function ModifyEntryModal({
  onClose,
  data: { openType, initialData }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    initialData?: DiaryEntry
  }
}) {
  const { t } = useModuleTranslation()

  const createMutation = useForgeMutation(forgeAPI.diary.create, {
    action: 'create',
    queryKey: forgeAPI.diary.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.diary.update.input({ id: initialData?.id ?? '' }),
    {
      action: 'update',
      queryKey: forgeAPI.diary.key
    }
  )

  const form = useForm({
    defaultValues: {
      date: initialData?.date ? dayjs(initialData.date).toDate() : dayjs().toDate(),
      feel: initialData?.feel ?? ('neutral' as const),
      title: initialData?.title ?? '',
      notes: initialData?.notes ?? '',
      image: getFormFileFieldInitialData(
        forgeAPI,
        initialData as Record<string, unknown> | undefined,
        initialData?.image
      )
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
            date: data.date.toISOString(),
            feel: data.feel,
            title: data.title,
            notes: data.notes,
            image: convertFormFileFieldData(data.image)
          }

          await (openType === 'create' ? createMutation : updateMutation)
            .mutateAsync(payload)
        }
      }}
      uiConfig={{
        icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `modals.diary.${openType}`,
        onClose
      }}
    >
      <DateField
        required
        control={form.control}
        icon="tabler:calendar"
        label="date"
        name="date"
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:mood-smile"
        label="feeling"
        name="feel"
        options={Object.entries(MOOD_CONFIG).map(([value, config]) => ({
          value: value as keyof typeof MOOD_CONFIG,
          text: t(config.labelKey),
          icon: config.icon,
          color: config.color
        }))}
      />
      <TextField
        required
        control={form.control}
        icon="tabler:heading"
        label="diaryTitle"
        name="title"
        placeholder="Market thoughts..."
      />
      <TextAreaField
        required
        control={form.control}
        icon="tabler:note"
        label="notes"
        name="notes"
        placeholder="Write your thoughts about today's market..."
      />
      <FileField
        control={form.control}
        icon="tabler:photo"
        label="image"
        mimeTypes={{ image: ['jpeg', 'png', 'gif'] }}
        name="image"
      />
    </FormModal>
  )
}

export default ModifyEntryModal

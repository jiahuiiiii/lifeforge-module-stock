import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { type InferInput, getFormFileFieldInitialData } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import type { DiaryEntry } from '..'
import { MOOD_CONFIG } from '../constants'

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
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const queryClient = useQueryClient()

  const mutation = useMutation(
    (openType === 'create'
      ? forgeAPI.diary.create
      : forgeAPI.diary.update.input({ id: initialData?.id || '' })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['jiahuiiiii--stock', 'diary']
        })
      },
      onError: () => {
        toast.error('Failed to create entry')
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<typeof forgeAPI.diary.create>['body']
  >({
    icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
    onClose,
    namespace: 'apps.jiahuiiiii$stock',
    submitButton: openType,
    title: `diary.${openType}`
  })
    .typesMap({
      date: 'datetime',
      feel: 'listbox',
      title: 'text',
      notes: 'textarea',
      image: 'file'
    })
    .setupFields({
      date: {
        icon: 'tabler:calendar',
        label: 'Date',
        required: true
      },
      feel: {
        icon: 'tabler:mood-smile',
        label: 'Feeling',
        options: Object.entries(MOOD_CONFIG).map(([key, value]) => ({
          value: key as keyof typeof MOOD_CONFIG,
          text: t(value.labelKey),
          icon: value.icon,
          color: value.color
        })),
        multiple: false,
        required: true
      },
      title: {
        icon: 'tabler:heading',
        label: 'Diary Title',
        placeholder: 'Market thoughts...',
        required: true
      },
      notes: {
        icon: 'tabler:note',
        label: 'Notes',
        placeholder:
          "Write your thoughts about today's market, your trades, observations...",
        required: true
      },
      image: {
        icon: 'tabler:photo',
        label: 'Image',
        optional: true,
        acceptedMimeTypes: {
          image: ['jpeg', 'png', 'gif']
        }
      }
    })
    .initialData({
      ...initialData,
      date: initialData?.date
        ? dayjs(initialData.date).toDate()
        : dayjs().toDate(),
      feel: initialData?.feel || 'neutral',
      image: getFormFileFieldInitialData(
        forgeAPI,
        initialData,
        initialData?.image
      )
    })

    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyEntryModal

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import forgeAPI from '@/utils/forgeAPI'

import type { DiaryEntry } from '../../..'
import ModifyEntryModal from '../../ModifyEntryModal'

function ActionMenu({ entry }: { entry: DiaryEntry }) {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const { open } = useModalStore()

  const queryClient = useQueryClient()

  const deleteMutation = useMutation(
    forgeAPI.diary.remove.input({ id: entry.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['jiahuiiiii--stock', 'diary']
        })
      },
      onError: () => {
        toast.error(t('errors.diary.removeFailed'))
      }
    })
  )

  const handleDeleteEntry = useCallback(() => {
    open(ConfirmationModal, {
      title: t('modals.diary.remove'),
      description: t('modals.diary.removeConfirmation', { name: entry.title }),
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [entry])

  const handleUpdateEntry = useCallback(() => {
    open(ModifyEntryModal, {
      openType: 'update',
      initialData: entry
    })
  }, [entry])

  return (
    <ContextMenu classNames={{ wrapper: 'absolute right-3 top-3' }}>
      <ContextMenuItem
        icon="tabler:pencil"
        label="edit"
        onClick={handleUpdateEntry}
      />
      <ContextMenuItem
        dangerous
        icon="tabler:trash"
        label="delete"
        onClick={handleDeleteEntry}
      />
    </ContextMenu>
  )
}

export default ActionMenu

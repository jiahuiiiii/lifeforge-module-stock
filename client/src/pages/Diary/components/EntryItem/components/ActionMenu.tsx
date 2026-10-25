import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { DiaryEntry } from '../../..'
import ModifyEntryModal from '../../ModifyEntryModal'

function ActionMenu({ entry }: { entry: DiaryEntry }) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const deleteMutation = useForgeMutation(
    forgeAPI.diary.remove.input({ id: entry.id }),
    {
      action: 'delete',
      queryKey: forgeAPI.diary.key
    }
  )

  function handleDeleteEntry() {
    open(ConfirmationModal, {
      title: t('modals.diary.remove'),
      description: t('modals.diary.removeConfirmation', { name: entry.title }),
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }

  function handleUpdateEntry() {
    open(ModifyEntryModal, {
      openType: 'update',
      initialData: entry
    })
  }

  return (
    <ContextMenu position="absolute" right="1em" top="1em">
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

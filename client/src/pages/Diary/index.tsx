import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useMemo } from 'react'

import type { InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContentWrapperWithSidebar,
  EmptyStateScreen,
  FAB,
  LayoutWithSidebar,
  ModuleHeader,
  Scrollbar,
  Stack,
  Text,
  WithQuery,
  useModalStore,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import EntryItem from './components/EntryItem'
import InnerHeader from './components/InnerHeader'
import ModifyEntryModal from './components/ModifyEntryModal'
import Sidebar from './components/Sidebar'
import useFilter from './hooks/useFilter'

export type DiaryEntry = InferOutput<typeof forgeAPI.diary.list>[number]

dayjs.extend(relativeTime)

function Diary() {
  const { t } = useModuleTranslation()
  const { language } = usePersonalization()
  const { open } = useModalStore()
  const entriesQuery = useQuery(forgeAPI.diary.list.queryOptions())
  const { filterMood } = useFilter()

  const filteredEntries = useMemo(() => {
    if (!entriesQuery.data) return []

    return filterMood === 'all'
      ? entriesQuery.data
      : entriesQuery.data.filter(entry => entry.feel === filterMood)
  }, [entriesQuery.data, filterMood])

  const groupedEntries = useMemo(
    () =>
      filteredEntries.reduce<Record<string, DiaryEntry[]>>((groups, entry) => {
        const monthYear = dayjs(entry.date).locale(language).format('MMMM YYYY')

        groups[monthYear] = [...(groups[monthYear] ?? []), entry]

        return groups
      }, {}),
    [filteredEntries, language]
  )

  function handleCreateEntry() {
    open(ModifyEntryModal, { openType: 'create' })
  }

  return (
    <>
      <ModuleHeader
        icon="tabler:notebook"
        title="diary"
        trailing={
          <Button
            display={{ base: 'none', md: 'flex' }}
            icon="tabler:plus"
            tProps={{
              item: t('items.diary')
            }}
            onClick={handleCreateEntry}
          >
            new
          </Button>
        }
      />
      <LayoutWithSidebar>
        <Sidebar />
        <ContentWrapperWithSidebar>
          <InnerHeader totalItemsCount={filteredEntries.length} />
          <WithQuery query={entriesQuery}>
            {() =>
              filteredEntries.length > 0 ? (
                <Scrollbar>
                  <Stack gap="lg" mt="lg">
                    {Object.entries(groupedEntries).map(
                      ([monthYear, monthEntries]) => (
                        <Stack key={monthYear} gap="sm">
                          <Text
                            color="muted"
                            size="sm"
                            tracking="wider"
                            transform="uppercase"
                            weight="semibold"
                          >
                            {monthYear}
                          </Text>
                          <Stack gap="sm">
                            {monthEntries.map(entry => (
                              <EntryItem key={entry.id} entry={entry} />
                            ))}
                          </Stack>
                        </Stack>
                      )
                    )}
                  </Stack>
                  <FAB visibilityBreakpoint="md" onClick={handleCreateEntry} />
                </Scrollbar>
              ) : (
                <EmptyStateScreen
                  icon="tabler:notebook-off"
                  message={{ id: 'diary' }}
                />
              )
            }
          </WithQuery>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </>
  )
}

export default Diary

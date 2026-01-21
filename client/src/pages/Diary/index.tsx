import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Button,
  ContentWrapperWithSidebar,
  EmptyStateScreen,
  FAB,
  LayoutWithSidebar,
  ModuleHeader,
  Scrollbar,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type InferOutput, usePersonalization } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import EntryItem from './components/EntryItem'
import InnerHeader from './components/InnerHeader'
import ModifyEntryModal from './components/ModifyEntryModal'
import Sidebar from './components/Sidebar'
import useFilter from './hooks/useFilter'

export type DiaryEntry = InferOutput<typeof forgeAPI.diary.list>[number]

dayjs.extend(relativeTime)

function Diary() {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const { language } = usePersonalization()

  const { open } = useModalStore()

  const entriesQuery = useQuery(forgeAPI.diary.list.queryOptions())

  const { filterMood } = useFilter()

  const filteredEntries = useMemo(() => {
    if (!entriesQuery.data) return []

    return filterMood === 'all'
      ? entriesQuery.data
      : entriesQuery.data.filter(e => e.feel === filterMood)
  }, [entriesQuery.data, filterMood])

  const groupedEntries = filteredEntries.reduce(
    (acc, entry) => {
      const monthYear = dayjs(entry.date).locale(language).format('MMMM YYYY')

      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(entry)

      return acc
    },
    {} as Record<string, DiaryEntry[]>
  )

  const handleCreateEntry = () => {
    open(ModifyEntryModal, { openType: 'create' })
  }

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            namespace="apps.jiahuiiiii$stock"
            tProps={{
              item: t('items.diary')
            }}
            onClick={handleCreateEntry}
          >
            new
          </Button>
        }
        icon="tabler:notebook"
        namespace="apps.jiahuiiiii$stock"
        title="diary"
        tKey="subsectionsTitleAndDesc"
      />
      <LayoutWithSidebar>
        <Sidebar />
        <ContentWrapperWithSidebar>
          <InnerHeader totalItemsCount={filteredEntries.length} />
          <WithQuery query={entriesQuery}>
            {() =>
              filteredEntries.length > 0 ? (
                <Scrollbar className="mt-6">
                  <div className="mb-8 space-y-6">
                    {Object.entries(groupedEntries).map(
                      ([monthYear, monthEntries]) => (
                        <div key={monthYear}>
                          <h2 className="text-bg-500 mb-3 font-semibold tracking-wider uppercase">
                            {monthYear}
                          </h2>
                          <div className="space-y-4">
                            {monthEntries.map(entry => (
                              <EntryItem key={entry.id} entry={entry} />
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <FAB visibilityBreakpoint="md" onClick={handleCreateEntry} />
                </Scrollbar>
              ) : (
                <EmptyStateScreen
                  icon="tabler:notebook-off"
                  message={{
                    id: 'diary',
                    namespace: 'apps.jiahuiiiii$stock'
                  }}
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

import { Button, useModuleSidebarState } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { MOOD_CONFIG } from '../constants'
import useFilter from '../hooks/useFilter'

function InnerHeader({ totalItemsCount }: { totalItemsCount: number }) {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const { setIsSidebarOpen } = useModuleSidebarState()

  const { filterMood } = useFilter()

  return (
    <>
      <header className="flex-between flex w-full">
        <div className="flex min-w-0 items-end">
          <h1 className="truncate text-2xl font-semibold xl:text-3xl">
            {filterMood === 'all'
              ? t('diary.headers.allEntries')
              : t(MOOD_CONFIG[filterMood].labelKey)}
          </h1>
          <span className="text-bg-500 mr-8 ml-2">({totalItemsCount})</span>
        </div>
        <Button
          className="lg:hidden"
          icon="tabler:menu"
          variant="plain"
          onClick={() => setIsSidebarOpen(true)}
        />
      </header>
    </>
  )
}

export default InnerHeader

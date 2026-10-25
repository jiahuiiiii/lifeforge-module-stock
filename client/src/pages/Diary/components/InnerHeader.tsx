import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  Flex,
  Text,
  useModuleSidebarState
} from '@lifeforge/ui'

import { MOOD_CONFIG } from '../constants'
import useFilter from '../hooks/useFilter'

function InnerHeader({ totalItemsCount }: { totalItemsCount: number }) {
  const { t } = useModuleTranslation()
  const { setIsSidebarOpen } = useModuleSidebarState()
  const { filterMood } = useFilter()

  return (
    <Flex justify="between">
      <Text as="h1" weight="semibold">
        <Text size="3xl">
          {filterMood === 'all'
            ? t('diary.headers.allEntries')
            : t(MOOD_CONFIG[filterMood].labelKey)}{' '}
        </Text>
        <Text as="span" color="muted" size="base">
          ({totalItemsCount})
        </Text>
      </Text>
      <Button
        display={{ base: 'flex', lg: 'none' }}
        icon="tabler:menu"
        variant="plain"
        onClick={() => setIsSidebarOpen(true)}
      />
    </Flex>
  )
}

export default InnerHeader

import { SidebarDivider, SidebarItem, SidebarWrapper } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import useFilter from '../../hooks/useFilter'
import MoodSection from './components/MoodSection'

function Sidebar() {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const { filterMood, setFilterMood } = useFilter()

  return (
    <SidebarWrapper>
      <SidebarItem
        active={filterMood === 'all'}
        icon="tabler:list"
        label={t('diary.sidebar.allEntries')}
        onClick={() => setFilterMood('all')}
      />
      <SidebarDivider />
      <MoodSection />
    </SidebarWrapper>
  )
}

export default Sidebar

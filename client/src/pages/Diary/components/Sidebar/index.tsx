import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarDivider, SidebarItem, SidebarWrapper } from '@lifeforge/ui'

import useFilter from '../../hooks/useFilter'
import MoodSection from './components/MoodSection'

function Sidebar() {
  const { t } = useModuleTranslation()
  const { filterMood, setFilterMood } = useFilter()

  return (
    <SidebarWrapper>
      <SidebarItem
        active={filterMood === 'all'}
        icon="tabler:list"
        label="diary.sidebar.allEntries"
        onClick={() => setFilterMood('all')}
      />
      <SidebarDivider />
      <MoodSection />
    </SidebarWrapper>
  )
}

export default Sidebar

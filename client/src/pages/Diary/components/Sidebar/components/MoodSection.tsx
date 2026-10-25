import { SidebarItem, SidebarTitle } from '@lifeforge/ui'

import { MOODS, MOOD_CONFIG } from '../../../constants'
import useFilter from '../../../hooks/useFilter'

function MoodSection() {
  const { filterMood, setFilterMood } = useFilter()

  return (
    <>
      <SidebarTitle label="diary.sidebar.moods" />
      {MOODS.map(mood => {
        const config = MOOD_CONFIG[mood]

        return (
          <SidebarItem
            key={mood}
            active={filterMood === mood}
            icon={config.icon}
            label={config.labelKey}
            sideStripColor={config.color}
            onClick={() => setFilterMood(mood)}
          />
        )
      })}
    </>
  )
}

export default MoodSection

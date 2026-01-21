import { SidebarItem, SidebarTitle } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { MOODS, MOOD_CONFIG } from '../../../constants'
import useFilter from '../../../hooks/useFilter'

function MoodSection() {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const { filterMood, setFilterMood } = useFilter()

  return (
    <>
      <SidebarTitle label={t('diary.sidebar.moods')} />
      {MOODS.map(m => {
        const config = MOOD_CONFIG[m]

        return (
          <SidebarItem
            key={m}
            active={filterMood === m}
            icon={config.icon}
            label={t(config.labelKey)}
            sideStripColor={config.color}
            onClick={() => setFilterMood(m)}
          />
        )
      })}
    </>
  )
}

export default MoodSection

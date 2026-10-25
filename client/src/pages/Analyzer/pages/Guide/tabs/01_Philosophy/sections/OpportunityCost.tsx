import { useModuleTranslation } from '@lifeforge/localization'
import { Text, Widget } from '@lifeforge/ui'

function OpportunityCost() {
  const { t } = useModuleTranslation()

  return (
    <Widget
      icon="tabler:scale"
      iconColor="orange-500"
      title="guide.opportunityCost.title"
    >
      <Text color="muted">{t('guide.opportunityCost.desc')}</Text>
    </Widget>
  )
}

export default OpportunityCost

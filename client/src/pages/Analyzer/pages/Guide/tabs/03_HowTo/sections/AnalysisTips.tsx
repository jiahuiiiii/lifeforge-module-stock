import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Grid, Icon, Text, Widget, surface } from '@lifeforge/ui'

const TIP_KEYS = [
  'calculator',
  'compare',
  'trends',
  'zulu',
  'discount',
  'logbook'
] as const

const TIP_ICONS = {
  calculator: 'tabler:calculator',
  compare: 'tabler:chart-dots',
  trends: 'tabler:history',
  zulu: 'tabler:zoom-check',
  discount: 'tabler:discount',
  logbook: 'tabler:notebook'
}

function AnalysisTips() {
  const { t } = useModuleTranslation()

  return (
    <Widget
      icon="tabler:bulb"
      iconColor="yellow-500"
      title="guide.howto.tipsTitle"
    >
      <Grid gap="sm" templateCols={{ base: 1, sm: 2 }}>
        {TIP_KEYS.map(key => (
          <Card
            key={key}
            align="center"
            bg={surface.light}
            direction="row"
            gap="sm"
          >
            <Icon color="primary" icon={TIP_ICONS[key]} />
            <Text color="muted">{t(`guide.howto.tips.${key}`)}</Text>
          </Card>
        ))}
      </Grid>
    </Widget>
  )
}

export default AnalysisTips

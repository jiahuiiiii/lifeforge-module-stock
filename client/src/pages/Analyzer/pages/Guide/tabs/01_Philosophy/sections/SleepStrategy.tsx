import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Grid, Icon, Stack, Text, Widget, surface } from '@lifeforge/ui'

const QUALITATIVE_IDS = [
  'valueChain',
  'dividendPolicy',
  'management',
  'moat'
] as const

const QUALITATIVE_ICONS = {
  valueChain: 'tabler:link',
  dividendPolicy: 'tabler:coin',
  management: 'tabler:user-check',
  moat: 'tabler:shield'
}

function SleepStrategy() {
  const { t } = useModuleTranslation()

  return (
    <Widget
      icon="tabler:moon"
      iconColor="purple-500"
      title="guide.sleepStrategy.title"
    >
      <Stack gap="md">
        <Text color="muted">{t('guide.sleepStrategy.intro')}</Text>
        <Grid gap="sm" templateCols={{ base: 1, sm: 2 }}>
          {QUALITATIVE_IDS.map(id => (
            <Card key={id} bg={surface.light} gap="sm">
              <Icon color="primary" icon={QUALITATIVE_ICONS[id]} size="1.5em" />
              <Text weight="semibold">
                {t(`guide.qualitative.${id}.title`)}
              </Text>
              <Text color="muted" size="sm">
                {t(`guide.qualitative.${id}.desc`)}
              </Text>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Widget>
  )
}

export default SleepStrategy

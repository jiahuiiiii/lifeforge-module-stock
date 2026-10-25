import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Grid, Stack, Text, Widget, surface } from '@lifeforge/ui'

function ColdEyePhilosophy() {
  const { t } = useModuleTranslation()

  return (
    <Widget icon="tabler:eye" iconColor="blue-500" title="guide.coldEye.title">
      <Stack gap="lg">
        <Text color="muted">{t('guide.coldEye.intro')}</Text>
        <Stack gap="sm">
          <Text as="h3" size="xl" weight="semibold">
            {t('guide.coldEye.keyPrinciples')}
          </Text>
          <Grid gap="sm" templateCols={{ base: 1, sm: 3 }}>
            <Card bg={surface.light} gap="xs">
              <Text size="lg" weight="semibold">
                {t('guide.coldEye.gdpScore.title')}
              </Text>
              <Text color="muted">{t('guide.coldEye.gdpScore.desc')}</Text>
            </Card>
            <Card bg={surface.light} gap="xs">
              <Text size="lg" weight="semibold">
                {t('guide.coldEye.prcScore.title')}
              </Text>
              <Text color="muted">{t('guide.coldEye.prcScore.desc')}</Text>
            </Card>
            <Card bg={surface.light} gap="xs">
              <Text size="lg" weight="semibold">
                {t('guide.coldEye.threshold.title')}
              </Text>
              <Text color="muted">{t('guide.coldEye.threshold.desc')}</Text>
            </Card>
          </Grid>
        </Stack>
      </Stack>
    </Widget>
  )
}

export default ColdEyePhilosophy

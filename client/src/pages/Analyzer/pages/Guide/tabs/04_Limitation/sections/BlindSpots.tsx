import { useModuleTranslation } from '@lifeforge/localization'
import {
  Bordered,
  Card,
  Grid,
  Stack,
  Text,
  Widget,
  surface
} from '@lifeforge/ui'

function BlindSpots() {
  const { t } = useModuleTranslation()

  return (
    <Widget
      icon="tabler:alert-triangle"
      iconColor="red-500"
      title="guide.limitations.blindSpots.title"
    >
      <Stack gap="md">
        <Card bg={surface.light} gap="sm">
          <Text color="red-500" size="lg" weight="semibold">
            {t('guide.limitations.blindSpots.techGrowth.title')}
          </Text>
          <Text color="muted">
            {t('guide.limitations.blindSpots.techGrowth.intro')}
          </Text>
          <Grid gap="sm" templateCols={{ base: 1, sm: 2 }}>
            <Card gap="xs">
              <Text weight="semibold">
                {t(
                  'guide.limitations.blindSpots.techGrowth.dividendIssues.title'
                )}
              </Text>
              <Text color="muted">
                {t(
                  'guide.limitations.blindSpots.techGrowth.dividendIssues.desc'
                )}
              </Text>
            </Card>
            <Card gap="xs">
              <Text weight="semibold">
                {t('guide.limitations.blindSpots.techGrowth.peIssues.title')}
              </Text>
              <Text color="muted">
                {t('guide.limitations.blindSpots.techGrowth.peIssues.desc')}
              </Text>
            </Card>
          </Grid>
          <Bordered
            borderColor="red-500"
            borderSide="left"
            borderWidth="2px"
            pl="sm"
          >
            <Text color="muted" size="sm">
              {t('guide.limitations.blindSpots.techGrowth.result')}
            </Text>
          </Bordered>
        </Card>
        <Card bg={surface.light} gap="xs">
          <Text size="lg" weight="semibold">
            {t('guide.limitations.blindSpots.laggingIndicators.title')}
          </Text>
          <Text color="muted">
            {t('guide.limitations.blindSpots.laggingIndicators.desc')}
          </Text>
        </Card>
        <Card bg={surface.light} gap="xs">
          <Text size="lg" weight="semibold">
            {t('guide.limitations.blindSpots.simplifiedCashFlow.title')}
          </Text>
          <Text color="muted">
            {t('guide.limitations.blindSpots.simplifiedCashFlow.desc')}
          </Text>
        </Card>
      </Stack>
    </Widget>
  )
}

export default BlindSpots

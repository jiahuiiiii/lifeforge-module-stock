import { useModuleTranslation } from '@lifeforge/localization'
import { Card, Grid, Icon, Text, Widget, surface } from '@lifeforge/ui'

const STEP_ICONS = [
  'tabler:checkbox',
  'tabler:trending-up',
  'tabler:percentage',
  'tabler:chart-bar',
  'tabler:chart-pie',
  'tabler:activity',
  'tabler:coin',
  'tabler:star'
]

function StepByStep() {
  const { t } = useModuleTranslation()

  return (
    <Widget
      icon="tabler:list-numbers"
      iconColor="blue-500"
      title="guide.howto.stepByStep"
    >
      <Grid gap="sm" templateCols={{ base: 1, sm: 2, lg: 4 }}>
        {STEP_ICONS.map((icon, index) => {
          const step = index + 1

          return (
            <Card key={step} bg={surface.light} gap="sm">
              <Icon color="primary" icon={icon} size="1.5em" />
              <Text weight="semibold">
                {step.toString().padStart(2, '0')}.{' '}
                {t(`guide.howto.steps.${step}.title`)}
              </Text>
              <Text color="muted" size="sm">
                {t(`guide.howto.steps.${step}.desc`)}
              </Text>
            </Card>
          )
        })}
      </Grid>
    </Widget>
  )
}

export default StepByStep

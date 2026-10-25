import { useModuleTranslation } from '@lifeforge/localization'
import {
  Card,
  Flex,
  Grid,
  Icon,
  Stack,
  Text,
  Widget,
  colorWithOpacity
} from '@lifeforge/ui'

function TargetAudience() {
  const { t } = useModuleTranslation()

  const suitableItems = t(
    'guide.limitations.targetAudience.suitableFor.items',
    { returnObjects: true }
  ) as string[]

  const notSuitableItems = t(
    'guide.limitations.targetAudience.notSuitableFor.items',
    { returnObjects: true }
  ) as string[]

  return (
    <Widget
      icon="tabler:users"
      iconColor="blue-500"
      title="guide.limitations.targetAudience.title"
    >
      <Stack gap="md">
        <Grid gap="md" templateCols={{ base: 1, sm: 2 }}>
          <Card bg={colorWithOpacity('green-500', '5%')} gap="sm">
            <Flex align="center" gap="sm">
              <Icon color="green-500" icon="tabler:check" size="1.25em" />
              <Text color="green-500" weight="semibold">
                {t('guide.limitations.targetAudience.suitableFor.title')}
              </Text>
            </Flex>
            <Stack gap="xs">
              {suitableItems.map((item, index) => (
                <Text key={index} color="muted">
                  • {item}
                </Text>
              ))}
            </Stack>
          </Card>
          <Card bg={colorWithOpacity('red-500', '5%')} gap="sm">
            <Flex align="center" gap="sm">
              <Icon color="red-500" icon="tabler:x" size="1.25em" />
              <Text color="red-500" weight="semibold">
                {t('guide.limitations.targetAudience.notSuitableFor.title')}
              </Text>
            </Flex>
            <Stack gap="xs">
              {notSuitableItems.map((item, index) => (
                <Text key={index} color="muted">
                  • {item}
                </Text>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Flex align="start" gap="sm">
          <Icon icon="tabler:book" style={{ marginTop: '0.125em' }} />
          <Stack gap="xs">
            <Text weight="semibold">
              {t('guide.limitations.targetAudience.source.title')}
            </Text>
            <Text color="muted">
              {t('guide.limitations.targetAudience.source.desc')}
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </Widget>
  )
}

export default TargetAudience

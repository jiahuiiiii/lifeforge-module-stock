import { useModuleTranslation } from '@lifeforge/localization'
import {
  Card,
  COLORS,
  Flex,
  Grid,
  Icon,
  Stack,
  Text,
  Widget
} from '@lifeforge/ui'

const REPORT_ITEMS = [
  'incomeStatement',
  'balanceSheet',
  'cashFlowStatement'
] as const

const PROVIDERS = [
  { name: 'Yahoo Finance', key: 'yahooFinance', color: COLORS['blue-500'], icon: 'tabler:world' },
  { name: 'Morningstar', key: 'morningstar', color: COLORS['purple-500'], icon: 'tabler:star' },
  { name: 'SEC EDGAR', key: 'secEdgar', color: COLORS['orange-500'], icon: 'tabler:file' }
] as const

function FindingData() {
  const { t } = useModuleTranslation()

  return (
    <Widget
      icon="tabler:search"
      iconColor="green-500"
      title="guide.howto.findingData.title"
    >
      <Stack gap="md">
        <Text color="muted">{t('guide.howto.findingData.intro')}</Text>
        <Grid gap="md" templateCols={{ base: 1, sm: 2 }}>
          <Card bg={{ base: 'bg-100', dark: 'bg-800' }} gap="sm">
            <Text as="h3" size="lg" weight="semibold">
              {t('guide.howto.findingData.annualReports.title')}
            </Text>
            <Text color="muted" size="sm">
              {t('guide.howto.findingData.annualReports.desc')}
            </Text>
            <Stack gap="xs">
              {REPORT_ITEMS.map(item => (
                <Flex key={item} align="center" gap="sm">
                  <Icon color="primary" icon="tabler:check" size="1em" />
                  <Text color="muted">
                    {t(`guide.howto.findingData.annualReports.${item}`)}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </Card>
          <Card bg={{ base: 'bg-100', dark: 'bg-800' }} gap="sm">
            <Text as="h3" size="lg" weight="semibold">
              {t('guide.howto.findingData.dataProviders.title')}
            </Text>
            <Stack gap="sm">
              {PROVIDERS.map(provider => (
                <Flex key={provider.name} align="center" gap="sm">
                  <Icon
                    icon={provider.icon}
                    size="1em"
                    style={{ color: provider.color }}
                  />
                  <Text color="muted">
                    <Text weight="semibold">{provider.name}</Text> -{' '}
                    {t(
                      `guide.howto.findingData.dataProviders.${provider.key}`
                    )}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Stack>
    </Widget>
  )
}

export default FindingData

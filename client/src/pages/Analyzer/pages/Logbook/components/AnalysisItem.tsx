import dayjs from 'dayjs'
import _ from 'lodash'

import { type InferOutput, useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Card,
  COLORS,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Grid,
  Stack,
  TagChip,
  Text,
  colorWithOpacity,
  useModalStore
} from '@lifeforge/ui'

import { VERDICTS, getVerdict } from '@/pages/Analyzer/constants/verdict'
import { forgeAPI } from '@/manifest'

type AnalyzerLogItem = InferOutput<
  typeof forgeAPI.analyzer.logs.analyzer.list
>[number]

const LABELS_MAP = {
  cagr: { key: 'cagr', format: (value: number) => `${value.toFixed(1)}%` },
  dy: { key: 'dy', format: (value: number) => `${value.toFixed(1)}%` },
  pe: { key: 'pe', format: (value: number) => `${value.toFixed(1)}x` },
  margin: { key: 'margin', format: (value: number) => `${value.toFixed(1)}%` },
  roe: { key: 'roe', format: (value: number) => `${value.toFixed(1)}%` }
} as const

function ScoreChip({
  label,
  score,
  passed
}: {
  label: string
  score: number
  passed: boolean
}) {
  return (
    <Flex
      align="center"
      bg={colorWithOpacity(passed ? 'green-500' : 'red-500', '10%')}
      direction="column"
      gap="xs"
      p="sm"
      r="md"
    >
      <Text color="muted" size="sm" weight="medium">
        {label}
      </Text>
      <Text color={passed ? 'green-500' : 'red-500'} size="lg" weight="semibold">
        {score}
      </Text>
    </Flex>
  )
}

function AnalysisItem({ log }: { log: AnalyzerLogItem }) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const deleteMutation = useForgeMutation(
    forgeAPI.analyzer.logs.analyzer.remove.input({ id: log.id }),
    {
      action: 'delete',
      queryKey: forgeAPI.analyzer.logs.analyzer.key
    }
  )

  const gdpScore = log.scores.gdp ?? 0

  const prcScore = log.scores.prc ?? 0

  const verdict = getVerdict(gdpScore, prcScore)

  const totalScore = Object.values(log.scores).reduce(
    (total, score) => total + score,
    0
  )

  function handleDelete() {
    open(ConfirmationModal, {
      title: t('modals.deleteAnalysis.title'),
      description: t('modals.deleteAnalysis.description', {
        ticker: log.ticker
      }),
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }

  return (
    <Card gap="md">
      <Flex align="start" justify="between">
        <Stack gap="xs" minWidth="0">
          <Text size="xl" weight="semibold">
            {log.ticker}
          </Text>
          {log.company_name && <Text color="primary">{log.company_name}</Text>}
          <Text color="muted" size="sm">
            {dayjs(log.date).format('DD MMM YYYY')}
          </Text>
        </Stack>
        <Flex align="center" gap="sm">
          <TagChip
            color={VERDICTS[verdict].color}
            icon={VERDICTS[verdict].icon}
            label={`${verdict} (${totalScore})`}
          />
          <ContextMenu>
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="delete"
              onClick={handleDelete}
            />
          </ContextMenu>
        </Flex>
      </Flex>

      <Stack flex="1" gap="sm">
        <Grid gap="sm" templateCols={3}>
          <ScoreChip
            label={t('logbook.labels.gdp')}
            passed={gdpScore >= 50}
            score={gdpScore}
          />
          <ScoreChip
            label={t('logbook.labels.prc')}
            passed={prcScore >= 50}
            score={prcScore}
          />
          <Flex
            align="center"
            bg={{ base: 'bg-200', dark: 'bg-800' }}
            direction="column"
            gap="xs"
            p="sm"
            r="md"
          >
            <Text color="muted" size="sm">
              {t('logbook.labels.total')}
            </Text>
            <Text size="lg" weight="semibold">
              {totalScore}
            </Text>
          </Flex>
        </Grid>

        <Stack gap="xs">
          {(Object.keys(LABELS_MAP) as (keyof typeof LABELS_MAP)[]).map(
            key => (
              <Flex key={key} justify="between">
                <Text color="muted">{t(`logbook.labels.${LABELS_MAP[key].key}`)}</Text>
                <Text>
                  {LABELS_MAP[key].format(Number(log.values[key]) || 0)}
                </Text>
              </Flex>
            )
          )}
          <Flex justify="between">
            <Text color="muted">{t('logbook.labels.cashFlow')}</Text>
            <Text>
              {t(
                `settings.cashFlow.${_.camelCase(
                  String(log.values.cashFlow ?? '')
                )}`
              )}
            </Text>
          </Flex>
        </Stack>

        <Flex gap="sm" wrap="wrap">
          {log.quantitative.passedZulu && (
            <TagChip
              color={COLORS['green-500']}
              icon="tabler:check"
              label={t('logbook.tags.zuluPass')}
            />
          )}
          {log.quantitative.undervaluedPe && (
            <TagChip
              color={COLORS['green-500']}
              icon="tabler:check"
              label={t('logbook.tags.undervalued')}
            />
          )}
          <TagChip
            color={VERDICTS[verdict].color}
            icon={VERDICTS[verdict].icon}
            label={VERDICTS[verdict].label}
          />
        </Flex>
      </Stack>
    </Card>
  )
}

export default AnalysisItem

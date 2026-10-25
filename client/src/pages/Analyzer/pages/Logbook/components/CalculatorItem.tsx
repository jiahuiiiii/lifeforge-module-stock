import dayjs from 'dayjs'

import { type InferOutput, useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Stack,
  TagChip,
  Text,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

type CalculatorLogItem = InferOutput<
  typeof forgeAPI.analyzer.logs.calculator.list
>[number]

const METRIC_KEYS = ['cagr', 'dy', 'pe', 'margin', 'roe'] as const

const METRIC_CONFIG = {
  cagr: { labelKey: 'cagr', suffix: '%' },
  dy: { labelKey: 'dividendYield', suffix: '%' },
  pe: { labelKey: 'peRatio', suffix: 'x' },
  margin: { labelKey: 'profitMargin', suffix: '%' },
  roe: { labelKey: 'roe', suffix: '%' }
}

function CalculatorItem({ log }: { log: CalculatorLogItem }) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const deleteMutation = useForgeMutation(
    forgeAPI.analyzer.logs.calculator.remove.input({ id: log.id }),
    {
      action: 'delete',
      queryKey: forgeAPI.analyzer.logs.calculator.key
    }
  )

  function handleDelete() {
    open(ConfirmationModal, {
      title: t('modals.deleteCalculation.title'),
      description: t('modals.deleteCalculation.description', {
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
          {log.name && <Text color="primary">{log.name}</Text>}
          <Text color="muted" size="sm">
            {dayjs(log.date).format('YYYY-MM-DD')}
          </Text>
        </Stack>
        <Flex align="center" gap="sm">
          {log.exchange && <TagChip label={log.exchange} size="sm" />}
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
      <Stack gap="xs">
        {METRIC_KEYS.map(key => (
          <Flex key={key} justify="between">
            <Text color="muted">
              {t(`logbook.labels.${METRIC_CONFIG[key].labelKey}`)}
            </Text>
            {log.values_and_scores[key]?.value !== undefined ? (
              <Text>
                {log.values_and_scores[key]!.value!.toFixed(2)}
                {METRIC_CONFIG[key].suffix}
              </Text>
            ) : (
              <Text color="muted">{t('logbook.labels.na')}</Text>
            )}
          </Flex>
        ))}
      </Stack>
    </Card>
  )
}

export default CalculatorItem

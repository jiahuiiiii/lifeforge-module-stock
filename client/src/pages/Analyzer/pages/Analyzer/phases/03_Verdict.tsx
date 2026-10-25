import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  Flex,
  Grid,
  Stack,
  Text,
  colorWithOpacity
} from '@lifeforge/ui'

import { VERDICTS, getVerdict } from '@/pages/Analyzer/constants/verdict'
import { forgeAPI } from '@/manifest'

import { useAnalyzer } from '../providers/AnalyzerProvider'

function ScoreCard({
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
      p="md"
      r="lg"
    >
      <Text color={passed ? 'green-500' : 'red-500'} size="sm" transform="uppercase" weight="semibold">
        {label}
      </Text>
      <Text color={passed ? 'green-500' : 'red-500'} size="4xl" weight="bold">
        {score}
      </Text>
    </Flex>
  )
}

function Verdict() {
  const { t } = useModuleTranslation()

  const {
    setPhase,
    baseInfo,
    qualitative,
    rawValues,
    derivedValues,
    resetValues
  } = useAnalyzer()

  const saveLogMutation = useForgeMutation(
    forgeAPI.analyzer.logs.analyzer.create,
    {
      action: 'create',
      queryKey: forgeAPI.analyzer.logs.analyzer.key
    }
  )

  const verdict = getVerdict(derivedValues.gdpScore, derivedValues.prcScore)

  const verdictConfig = VERDICTS[verdict]

  async function handleSaveLog() {
    await saveLogMutation.mutateAsync({
      ticker: baseInfo.ticker.toUpperCase(),
      stock_exchange: baseInfo.stockExchange.toUpperCase(),
      company_name: baseInfo.companyName,
      date: new Date().toISOString(),
      values: {
        cagr: rawValues.cagr,
        dy: rawValues.dy,
        pe: rawValues.pe,
        margin: rawValues.margin,
        roe: rawValues.roe,
        cashFlow: rawValues.cashFlow
      },
      scores: {
        gdp: derivedValues.gdpScore,
        prc: derivedValues.prcScore
      },
      quantitative: {
        passedZulu: derivedValues.passedZulu,
        undervaluedPe: derivedValues.undervaluedPE,
        ...qualitative
      }
    })

    resetValues()
  }

  return (
    <>
      <Flex
        align="center"
        direction="column"
        flex="1"
        justify="center"
        width="100%"
      >
        <Flex
          align="center"
          direction="column"
          mb="xl"
          px="xl"
          py="lg"
          r="2xl"
          style={{
            border: `2px solid ${verdictConfig.color}`,
            backgroundColor: `${verdictConfig.color}20`
          }}
        >
          <Text size="6xl" style={{ color: verdictConfig.color }} weight="bold">
            {verdict}
          </Text>
          <Text
            size="xl"
            style={{ color: verdictConfig.color }}
            weight="semibold"
          >
            {t(`analyzer.verdicts.${verdict.toLowerCase()}.label`)}
          </Text>
          <Text align="center" color="muted" mt="xs">
            {t(`analyzer.verdicts.${verdict.toLowerCase()}.description`)}
          </Text>
        </Flex>

        <Stack align="center" gap="xs" mb="lg">
          <Text size="3xl" weight="semibold">
            {baseInfo.stockExchange &&
              `${baseInfo.stockExchange.toUpperCase()}:`}
            {baseInfo.ticker.toUpperCase()}
          </Text>
          {baseInfo.companyName && (
            <Text color="muted" size="lg" weight="medium">
              {baseInfo.companyName}
            </Text>
          )}
        </Stack>

        <Grid gap="md" templateCols={3} width="100%">
          <ScoreCard
            label={t('analyzer.metrics.gdp')}
            passed={derivedValues.gdpScore >= 50}
            score={derivedValues.gdpScore}
          />
          <ScoreCard
            label={t('analyzer.metrics.prc')}
            passed={derivedValues.prcScore >= 50}
            score={derivedValues.prcScore}
          />
          <Flex
            align="center"
            bg={{ base: 'bg-200', dark: 'bg-800' }}
            direction="column"
            gap="xs"
            p="md"
            r="lg"
          >
            <Text color="muted" size="sm" transform="uppercase" weight="semibold">
              {t('analyzer.total')}
            </Text>
            <Text size="4xl" weight="bold">
              {derivedValues.gdpScore + derivedValues.prcScore}
            </Text>
            <Text color="muted" size="sm" transform="uppercase" weight="bold">
              {t('analyzer.points')}
            </Text>
          </Flex>
        </Grid>
      </Flex>

      <Flex gap="sm" justify="center" mt="xl">
        <Button
          icon="tabler:arrow-left"
          variant="secondary"
          onClick={() => setPhase(2)}
        >
          back
        </Button>
        <Button
          flex="1"
          icon="tabler:device-floppy"
          loading={saveLogMutation.isPending}
          onClick={handleSaveLog}
        >
          saveToLogbook
        </Button>
      </Flex>
    </>
  )
}

export default Verdict

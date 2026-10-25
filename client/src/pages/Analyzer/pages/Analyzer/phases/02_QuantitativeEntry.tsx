import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Button,
  COLORS,
  Flex,
  Grid,
  Icon,
  ListboxInput,
  ListboxOption,
  NumberInput,
  Stack,
  Text,
  TextInput
} from '@lifeforge/ui'

import { CASH_FLOW_OPTIONS } from '@/pages/Analyzer/constants/cashFlow'

import ScoreBadge from '../../Toolbox/components/ScoreBadge'
import { useAnalyzer } from '../providers/AnalyzerProvider'

function SectionHeader({
  color,
  title,
  children
}: {
  color: string
  title: string
  children?: React.ReactNode
}) {
  const { t } = useModuleTranslation()

  return (
    <Flex align="center" justify="between" mb="md" width="100%">
      <Flex align="center" gap="sm">
        <Box
          flexShrink="0"
          height="1.5em"
          r="full"
          style={{ backgroundColor: color }}
          width="0.25em"
        />
        <Text color="muted" tracking="wide" weight="semibold">
          {t(`calculators.categories.${title}`)}
        </Text>
      </Flex>
      {children && (
        <Text color="muted" weight="medium">
          {children}
        </Text>
      )}
    </Flex>
  )
}

function QuantitativeEntry() {
  const { t } = useModuleTranslation()

  const {
    baseInfo: { stockExchange, ticker, companyName },
    setBaseInfo,
    rawValues,
    setRawValues,
    derivedValues,
    setPhase,
    calculatorLogs
  } = useAnalyzer()

  const matchingLog = ticker.trim()
    ? calculatorLogs.find(
        log => log.ticker.toLowerCase() === ticker.trim().toLowerCase()
      )
    : null

  function handleFetchFromLogbook() {
    if (!matchingLog) return

    const values = matchingLog.values_and_scores

    setRawValues(previous => ({
      ...previous,
      ...(values.cagr?.value !== undefined
        ? { cagr: Number(values.cagr.value.toFixed(2)) }
        : {}),
      ...(values.dy?.value !== undefined
        ? { dy: Number(values.dy.value.toFixed(2)) }
        : {}),
      ...(values.pe?.value !== undefined
        ? { pe: Number(values.pe.value.toFixed(2)) }
        : {}),
      ...(values.margin?.value !== undefined
        ? { margin: Number(values.margin.value.toFixed(2)) }
        : {}),
      ...(values.roe?.value !== undefined
        ? { roe: Number(values.roe.value.toFixed(2)) }
        : {})
    }))

    if (!companyName && matchingLog.name) {
      setBaseInfo(previous => ({ ...previous, companyName: matchingLog.name }))
    }

    if (!stockExchange && matchingLog.exchange) {
      setBaseInfo(previous => ({
        ...previous,
        stockExchange: matchingLog.exchange
      }))
    }
  }

  return (
    <>
      <Stack flex="1" gap="xl" mb="lg">
        <Stack gap="sm">
          <Flex direction={{ base: 'column', sm: 'row' }} gap="md">
            <TextInput
              required
              icon="tabler:tag"
              label="inputs.stockTicker"
              placeholder="e.g., AAPL"
              value={ticker}
              onChange={value =>
                setBaseInfo(data => ({ ...data, ticker: value }))
              }
            />
            <TextInput
              icon="tabler:building"
              label="inputs.stockExchange"
              placeholder="e.g., NASDAQ"
              value={stockExchange}
              onChange={value =>
                setBaseInfo(data => ({ ...data, stockExchange: value }))
              }
            />
          </Flex>
          <TextInput
            icon="tabler:building-bank"
            label="inputs.companyName"
            placeholder="e.g., Apple Inc."
            value={companyName}
            onChange={value =>
              setBaseInfo(data => ({ ...data, companyName: value }))
            }
          />
        </Stack>

        {matchingLog && (
          <Button
            icon="tabler:file-import"
            type="button"
            variant="secondary"
            width="100%"
            onClick={handleFetchFromLogbook}
          >
            fetchFromLogbook
          </Button>
        )}

        <Box>
          <SectionHeader color={COLORS['lime-500']} title="gdp">
            {t('analyzer.score')} {derivedValues.gdpScore}/100
          </SectionHeader>
          <Grid gap="md" templateCols={{ base: 1, sm: 3 }}>
            <Stack gap="xs">
              <Flex align="center" justify="between">
                <Text color="muted" size="sm">
                  {t('analyzer.metrics.gCagr')}
                </Text>
                <ScoreBadge maxScore={50} score={derivedValues.cagrScore} />
              </Flex>
              <NumberInput
                required
                icon="tabler:trending-up"
                label="inputs.cagr"
                placeholder="e.g., 15"
                value={rawValues.cagr}
                onChange={value =>
                  setRawValues(data => ({ ...data, cagr: value }))
                }
              />
            </Stack>
            <Stack gap="xs">
              <Flex align="center" justify="between">
                <Text color="muted" size="sm">
                  {t('analyzer.metrics.dDividendYield')}
                </Text>
                <ScoreBadge maxScore={40} score={derivedValues.dyScore} />
              </Flex>
              <NumberInput
                required
                icon="tabler:percentage"
                label="inputs.dividendYield"
                placeholder="e.g., 3"
                value={rawValues.dy}
                onChange={value =>
                  setRawValues(data => ({ ...data, dy: value }))
                }
              />
            </Stack>
            <Stack gap="xs">
              <Flex align="center" justify="between">
                <Text color="muted" size="sm">
                  {t('analyzer.metrics.pPeRatio')}
                </Text>
                <ScoreBadge maxScore={30} score={derivedValues.peScore} />
              </Flex>
              <NumberInput
                required
                icon="tabler:chart-bar"
                label="inputs.peRatio"
                placeholder="e.g., 12"
                value={rawValues.pe}
                onChange={value =>
                  setRawValues(data => ({ ...data, pe: value }))
                }
              />
            </Stack>
          </Grid>
        </Box>

        <Box>
          <SectionHeader color={COLORS['blue-500']} title="prc">
            {t('analyzer.score')} {derivedValues.prcScore}/100
          </SectionHeader>
          <Grid gap="md" templateCols={{ base: 1, sm: 3 }}>
            <Stack gap="xs">
              <Flex align="center" justify="between">
                <Text color="muted" size="sm">
                  {t('analyzer.metrics.pProfitMargin')}
                </Text>
                <ScoreBadge maxScore={20} score={derivedValues.marginScore} />
              </Flex>
              <NumberInput
                required
                icon="tabler:chart-pie"
                label="inputs.profitMargin"
                placeholder="e.g., 20"
                value={rawValues.margin}
                onChange={value =>
                  setRawValues(data => ({ ...data, margin: value }))
                }
              />
            </Stack>
            <Stack gap="xs">
              <Flex align="center" justify="between">
                <Text color="muted" size="sm">
                  {t('analyzer.metrics.rRoe')}
                </Text>
                <ScoreBadge maxScore={20} score={derivedValues.roeScore} />
              </Flex>
              <NumberInput
                required
                icon="tabler:activity"
                label="inputs.roe"
                placeholder="e.g., 18"
                value={rawValues.roe}
                onChange={value =>
                  setRawValues(data => ({ ...data, roe: value }))
                }
              />
            </Stack>
            <Stack gap="xs">
              <Flex align="center" justify="between">
                <Text color="muted" size="sm">
                  {t('analyzer.metrics.cCashFlow')}
                </Text>
                <ScoreBadge maxScore={40} score={derivedValues.cashFlowScore} />
              </Flex>
              <ListboxInput
                icon="tabler:coin"
                label="inputs.cashFlow"
                renderContent={value => (
                  <Text>
                    {t(
                      `settings.cashFlow.${
                        CASH_FLOW_OPTIONS.find(option => option.value === value)
                          ?.labelKey ?? value
                      }`
                    )}
                  </Text>
                )}
                value={rawValues.cashFlow}
                onChange={value =>
                  setRawValues(data => ({
                    ...data,
                    cashFlow: value
                  }))
                }
              >
                {CASH_FLOW_OPTIONS.map(option => (
                  <ListboxOption
                    key={option.value}
                    label={t(`settings.cashFlow.${option.labelKey}`)}
                    value={option.value}
                  />
                ))}
              </ListboxInput>
            </Stack>
          </Grid>
        </Box>

        <Box>
          <SectionHeader color={COLORS['purple-500']} title="supplementary" />
          <NumberInput
            icon="tabler:history"
            label="inputs.tenYearAvgPe"
            placeholder="e.g., 20"
            value={rawValues.avgPE}
            onChange={value =>
              setRawValues(data => ({ ...data, avgPE: value }))
            }
          />
          <Flex gap="md" mt="sm" wrap="wrap">
            {derivedValues.passedZulu && (
              <Flex align="center" gap="xs">
                <Icon color="green-500" icon="tabler:check" />
                <Text color="green-500" size="sm">
                  {t('analyzer.zuluPass')}
                </Text>
              </Flex>
            )}
            {derivedValues.undervaluedPE && (
              <Flex align="center" gap="xs">
                <Icon color="green-500" icon="tabler:check" />
                <Text color="green-500" size="sm">
                  {t('analyzer.undervalued')}
                </Text>
              </Flex>
            )}
          </Flex>
        </Box>
      </Stack>

      <Flex gap="sm">
        <Button
          icon="tabler:arrow-left"
          variant="secondary"
          onClick={() => setPhase(1)}
        >
          back
        </Button>
        <Button
          disabled={!ticker.trim()}
          flex="1"
          icon="tabler:arrow-right"
          onClick={() => setPhase(3)}
        >
          viewVerdict
        </Button>
      </Flex>
    </>
  )
}

export default QuantitativeEntry

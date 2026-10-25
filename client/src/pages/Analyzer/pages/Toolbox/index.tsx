import { useCallback, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  COLORS,
  FAB,
  Flex,
  Grid,
  ModuleHeader,
  Stack,
  Text,
  useModalStore
} from '@lifeforge/ui'

import { AnalyzerSettingsProvider } from '../../providers/useAnalyzerSettings'
import Calculator from './components/Calculator'
import SaveCalculationModal from './components/SaveCalculationModal'
import CALCULATORS from './config'
import type { InitialResults } from './utils/initialResultsInference'
import createInitialResults from './utils/initialResultsInference'

type Results = InitialResults<typeof CALCULATORS>

function Toolbox() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const [results, setResults] = useState<Results>(() =>
    createInitialResults(CALCULATORS)
  )

  const handleResultChange = useCallback(
    <Key extends keyof Results>(key: Key, result: Results[Key]) => {
      setResults(previous => ({ ...previous, [key]: result }))
    },
    []
  )

  const hasAnyValue =
    results.cagr.cagr !== null ||
    results.dy.dyield !== null ||
    results.pe.peRatio !== null ||
    results.margin.margin !== null ||
    results.roe.roe !== null

  function handleSave() {
    open(SaveCalculationModal, {
      results: {
        values_and_scores: {
          cagr: {
            value: results.cagr.cagr ?? undefined,
            score: results.cagr.score
          },
          dy: {
            value: results.dy.dyield ?? undefined,
            score: results.dy.score
          },
          pe: {
            value: results.pe.peRatio ?? undefined,
            score: results.pe.score
          },
          margin: {
            value: results.margin.margin ?? undefined,
            score: results.margin.score
          },
          roe: {
            value: results.roe.roe ?? undefined,
            score: results.roe.score
          }
        },
        total_score:
          results.cagr.score +
          results.dy.score +
          results.pe.score +
          results.margin.score +
          results.roe.score
      }
    })
  }

  return (
    <AnalyzerSettingsProvider>
      <ModuleHeader icon="tabler:calculator" title="toolbox" />
      <Stack gap="lg" mb="2xl">
        {CALCULATORS.map(section => (
          <Stack key={section.title} gap="sm">
            <Flex align="center" gap="sm">
              <Box
                flexShrink="0"
                height="1.5em"
                r="full"
                style={{ backgroundColor: COLORS[section.color] }}
                width="0.25em"
              />
              <Text color="muted" tracking="wide" weight="semibold">
                {t(`calculators.categories.${section.title}`)}
              </Text>
            </Flex>
            <Grid gap="md" templateCols={{ base: 1, md: 2, lg: 3 }}>
              {Object.entries(section.children).map(([key, config]) => (
                <Calculator
                  key={key}
                  calculatorKey={key}
                  color={section.color}
                  config={config}
                  onResultChange={result =>
                    handleResultChange(
                      key as keyof Results,
                      result as Results[keyof Results]
                    )
                  }
                />
              ))}
            </Grid>
          </Stack>
        ))}
      </Stack>
      {hasAnyValue && (
        <FAB icon="tabler:device-floppy" visibilityBreakpoint={false} onClick={handleSave} />
      )}
    </AnalyzerSettingsProvider>
  )
}

export default Toolbox

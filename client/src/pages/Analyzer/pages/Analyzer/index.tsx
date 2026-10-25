import { createElement } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Stack, Text } from '@lifeforge/ui'

import { AnalyzerSettingsProvider } from '../../providers/useAnalyzerSettings'
import HorizontalStepper from './components/HorizontalStepper'
import QualitativeGate from './phases/01_QualitativeGate'
import QuantitativeEntry from './phases/02_QuantitativeEntry'
import Verdict from './phases/03_Verdict'
import AnalyzerProvider, { useAnalyzer } from './providers/AnalyzerProvider'

export const PHASE_KEYS = [
  'sleepStrategyGate',
  'quantitativeEntry',
  'verdict'
] as const

export const PHASE_COMPONENTS = [QualitativeGate, QuantitativeEntry, Verdict]

function AnalyzerContent() {
  const { t } = useModuleTranslation()
  const { phase } = useAnalyzer()

  const phaseKey = PHASE_KEYS[phase - 1]

  return (
    <Flex direction="column" flex="1" width="100%">
      <HorizontalStepper />
      <Stack gap="xs" mb="lg">
        <Text color="primary" size="sm" tracking="widest" transform="uppercase" weight="semibold">
          {t('analyzer.phase')} {phase}
        </Text>
        <Text as="h2" size="2xl" weight="semibold">
          {t(`analyzer.phases.${phaseKey}.name`)}
        </Text>
        <Text color="muted">
          {t(`analyzer.phases.${phaseKey}.description`)}
        </Text>
      </Stack>
      <Flex direction="column" flex="1" mb="2xl">
        {createElement(PHASE_COMPONENTS[phase - 1]!)}
      </Flex>
    </Flex>
  )
}

export default function Analyzer() {
  return (
    <AnalyzerSettingsProvider>
      <AnalyzerProvider>
        <AnalyzerContent />
      </AnalyzerProvider>
    </AnalyzerSettingsProvider>
  )
}

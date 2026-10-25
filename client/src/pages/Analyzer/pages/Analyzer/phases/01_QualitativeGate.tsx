import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  Card,
  Checkbox,
  ConfirmationModal,
  Flex,
  Stack,
  Text,
  surface,
  useModalStore
} from '@lifeforge/ui'

import { useAnalyzer } from '../providers/AnalyzerProvider'

const QUALITATIVE_IDS = [
  'valueChain',
  'dividendPolicy',
  'management',
  'moat'
] as const

function QualitativeGate() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const { qualitative, setQualitative, setPhase } = useAnalyzer()

  const allQualitativePass = Object.values(qualitative).every(Boolean)

  function handleProceed() {
    if (allQualitativePass) {
      setPhase(2)

      return
    }

    open(ConfirmationModal, {
      title: t('modals.proceedWithCaution.title'),
      description: t('modals.proceedWithCaution.description'),
      onConfirm: () => {
        setPhase(2)
      }
    })
  }

  return (
    <>
      <Stack flex="1" gap="md" mb="lg">
        {QUALITATIVE_IDS.map(id => (
          <Card
            key={id}
            align="center"
            bg={surface.light}
            direction="row"
            justify="between"
          >
            <Stack gap="xs" minWidth="0">
              <Text size="lg" weight="medium">
                {t(`analyzer.qualitative.${id}.label`)}
              </Text>
              <Text color="muted" size="sm">
                {t(`analyzer.qualitative.${id}.description`)}
              </Text>
            </Stack>
            <Flex flexShrink="0">
              <Checkbox
                checked={qualitative[id]}
                onCheckedChange={checked =>
                  setQualitative(previous => ({
                    ...previous,
                    [id]: checked
                  }))
                }
              />
            </Flex>
          </Card>
        ))}
      </Stack>
      <Button
        icon="tabler:arrow-right"
        iconPosition="end"
        variant={allQualitativePass ? 'primary' : 'secondary'}
        width="100%"
        onClick={handleProceed}
      >
        {allQualitativePass ? 'proceed' : 'skip'}
      </Button>
    </>
  )
}

export default QualitativeGate

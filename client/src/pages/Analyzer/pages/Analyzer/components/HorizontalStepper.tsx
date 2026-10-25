import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Flex,
  Icon,
  Text,
  Transition,
  colorWithOpacity,
  usePersonalization
} from '@lifeforge/ui'

import { PHASE_KEYS } from '..'
import { useAnalyzer } from '../providers/AnalyzerProvider'

function HorizontalStepper() {
  const { t } = useModuleTranslation()
  const { phase, setPhase } = useAnalyzer()
  const { derivedThemeColor, getMostReadableColor } = usePersonalization()

  return (
    <Flex align="center" justify="center" mb="xl" width="100%">
      {PHASE_KEYS.map((key, index) => {
        const stepNumber = index + 1

        const isCompleted = phase > stepNumber

        const isCurrent = phase === stepNumber

        return (
          <Flex key={key} align="center">
            <Flex
              align="center"
              as="button"
              gap="sm"
              onClick={() => setPhase(stepNumber)}
            >
              <Transition>
                <Flex
                  align="center"
                  bg={
                    isCompleted
                      ? colorWithOpacity('custom-500', '20%')
                      : isCurrent
                        ? 'custom-500'
                        : {
                            base: 'bg-200',
                            dark: colorWithOpacity('bg-700', '50%')
                          }
                  }
                  flexShrink="0"
                  height="2.5em"
                  justify="center"
                  r="full"
                  style={{
                    color: isCompleted
                      ? 'var(--color-custom-500)'
                      : isCurrent
                        ? getMostReadableColor(derivedThemeColor)
                        : undefined
                  }}
                  width="2.5em"
                >
                  {isCompleted ? (
                    <Icon icon="tabler:check" />
                  ) : (
                    <Text weight="semibold">{stepNumber}</Text>
                  )}
                </Flex>
              </Transition>
              <Text
                color={
                  isCurrent ? 'primary' : isCompleted ? undefined : 'muted'
                }
                display={{ base: 'none', sm: 'block' }}
                weight="medium"
              >
                {t(`analyzer.phases.${key}.name`)}
              </Text>
            </Flex>
            {index < PHASE_KEYS.length - 1 && (
              <Transition>
                <Box
                  bg={
                    isCompleted
                      ? colorWithOpacity('custom-500', '20%')
                      : {
                          base: 'bg-200',
                          dark: colorWithOpacity('bg-700', '50%')
                        }
                  }
                  height="0.125em"
                  mx="md"
                  width={{ base: '3em', sm: '4em' }}
                />
              </Transition>
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}

export default HorizontalStepper

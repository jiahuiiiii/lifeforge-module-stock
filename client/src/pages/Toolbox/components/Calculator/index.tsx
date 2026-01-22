import { useEffect, useMemo, useState } from 'react'

import { useAnalyzerSettings } from '@/pages/Analyzer/providers/useAnalyzerSettings'

import type { CalculatorConfig } from '../../utils/calculatorFactory'
import CalculatorField from './components/CalculatorField'
import CalculatorWrapper from './components/CalculatorWrapper'

function Calculator({
  calculatorKey,
  config,
  color,
  onResultChange
}: {
  calculatorKey: string
  config: CalculatorConfig
  color: string
  onResultChange: (result: Record<string, unknown>) => void
}) {
  const settings = useAnalyzerSettings()

  const fieldEntries = Object.entries(config.fieldConfigs)

  const [fieldValues, setFieldValues] = useState<
    Record<string, string | number>
  >(() => {
    const initial: Record<string, string | number> = {}

    for (const [name, field] of fieldEntries) {
      initial[name] = 'type' in field ? 0 : ''
    }

    return initial
  })

  const result = useMemo(() => {
    return config.calculate(fieldValues, settings)
  }, [fieldValues, settings, config])

  useEffect(() => {
    onResultChange(result)
  }, [result, onResultChange])

  const handleFieldChange = (name: string, value: string | number) => {
    setFieldValues(prev => ({ ...prev, [name]: value }))
  }

  return (
    <CalculatorWrapper
      calculatorKey={calculatorKey}
      color={color}
      icon={config.icon}
      result={config.displayResult(result)}
    >
      {fieldEntries.map(([name, field]) => {
        return (
          <CalculatorField
            key={name}
            field={field}
            value={fieldValues[name]}
            onChange={v => handleFieldChange(name, v)}
          />
        )
      })}
    </CalculatorWrapper>
  )
}

export default Calculator

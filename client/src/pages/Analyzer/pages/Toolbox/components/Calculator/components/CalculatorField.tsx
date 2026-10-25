import { CurrencyInput, NumberInput, TextInput } from '@lifeforge/ui'

import type { CalculatorConfig } from '@/pages/Analyzer/pages/Toolbox/utils/calculatorFactory'

function CalculatorField({
  field,
  value,
  onChange
}: {
  field: CalculatorConfig['fieldConfigs'][keyof CalculatorConfig['fieldConfigs']]
  value: string | number
  onChange: (value: string | number) => void
}) {
  if (!('type' in field)) {
    return (
      <TextInput
        icon={field.icon}
        label={field.label}
        placeholder={field.placeholder ?? 'Enter a value'}
        value={value as string}
        onChange={onChange}
      />
    )
  }

  if (field.type === 'currency') {
    return (
      <CurrencyInput
        icon={field.icon}
        label={field.label}
        value={value as number}
        onChange={onChange}
      />
    )
  }

  return (
    <NumberInput
      icon={field.icon}
      label={field.label}
      max={field.max}
      min={field.min}
      placeholder={field.placeholder}
      value={value as number}
      onChange={onChange}
    />
  )
}

export default CalculatorField

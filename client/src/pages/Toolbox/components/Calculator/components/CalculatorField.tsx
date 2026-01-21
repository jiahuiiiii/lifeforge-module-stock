import { CurrencyInput, NumberInput, TextInput } from 'lifeforge-ui'

import type { CalculatorConfig } from '@/pages/Toolbox/utils/calculatorFactory'

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
        namespace="apps.jiahuiiiii$stock"
        placeholder={field.placeholder || 'Enter a value'}
        value={value as string}
        onChange={v => onChange(v)}
      />
    )
  }

  if (field.type === 'currency') {
    return (
      <CurrencyInput
        icon={field.icon}
        label={field.label}
        namespace="apps.jiahuiiiii$stock"
        placeholder={field.placeholder || 'Enter a value'}
        value={value as number}
        onChange={v => onChange(v)}
      />
    )
  }

  return (
    <NumberInput
      icon={field.icon}
      label={field.label}
      max={field.max}
      min={field.min}
      namespace="apps.jiahuiiiii$stock"
      placeholder={field.placeholder}
      value={value as number}
      onChange={v => onChange(v)}
    />
  )
}

export default CalculatorField

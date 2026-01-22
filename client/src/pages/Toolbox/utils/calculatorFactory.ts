import type { CurrencyInput, NumberInput, TextInput } from 'lifeforge-ui'
import type z from 'zod'

import type { AnalyzerSettingsContextValue } from '@/providers/useAnalyzerSettings'

type NumberInputProps = Omit<
  React.ComponentProps<typeof NumberInput>,
  'value' | 'onChange'
>
type CurrencyInputProps = Omit<
  React.ComponentProps<typeof CurrencyInput>,
  'value' | 'onChange'
>
type TextInputProps = Omit<
  React.ComponentProps<typeof TextInput>,
  'value' | 'onChange'
>

export type FieldConfigs<TFields extends z.ZodObject<z.ZodRawShape>> = {
  [K in keyof z.infer<TFields>]: z.infer<TFields>[K] extends string
    ? TextInputProps
    : z.infer<TFields>[K] extends number
      ?
          | ({ type: 'number' } & NumberInputProps)
          | ({ type: 'currency' } & CurrencyInputProps)
      : never
}

export type FieldConfigValue =
  | TextInputProps
  | ({ type: 'number' } & NumberInputProps)
  | ({ type: 'currency' } & CurrencyInputProps)

export type CalculatorConfig = {
  icon: string
  fields: unknown
  fieldConfigs: Record<string, FieldConfigValue>
  result: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calculate: (fields: any, settings: any) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayResult: (result: any) => React.ReactNode
}

export default function createCalculator(icon: string) {
  return {
    fields: <TFields extends z.ZodObject>(fields: TFields) => ({
      config: (configs: FieldConfigs<TFields>) => ({
        result: <TResult extends z.ZodObject>(result: TResult) => ({
          calculate: (
            calculateFn: (
              fields: z.infer<TFields>,
              settings: NonNullable<AnalyzerSettingsContextValue['settings']>
            ) => z.infer<TResult>
          ) => ({
            displayResult: (
              componentFn: (result: z.infer<TResult>) => React.ReactNode
            ) => {
              return {
                icon,
                fields,
                fieldConfigs: configs,
                result,
                calculate: calculateFn,
                displayResult: componentFn
              } satisfies CalculatorConfig
            }
          })
        })
      })
    })
  }
}

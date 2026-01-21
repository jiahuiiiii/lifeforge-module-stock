type CalculatorSection = {
  title: string
  color: string
  children: Record<string, unknown>
}

type AllChildren<T extends readonly CalculatorSection[]> = UnionToIntersection<
  T[number]['children']
>

export type InitialResults<T extends readonly CalculatorSection[]> = {
  [K in keyof AllChildren<T>]: InferResultType<AllChildren<T>[K]>
}

type InferResultType<T> = T extends { result: infer R }
  ? R extends { _type: infer U }
    ? U
    : R extends { parse: (arg: unknown) => infer U }
      ? U
      : never
  : never

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export default function createInitialResults<
  T extends readonly CalculatorSection[]
>(calculators: T): InitialResults<T> {
  return Object.fromEntries(
    calculators.flatMap(section =>
      Object.entries(section.children).map(([key, config]) => {
        const shape = (config as { result: { shape: Record<string, unknown> } })
          .result.shape

        const initial: Record<string, unknown> = {}

        for (const [fieldKey, zodType] of Object.entries(shape)) {
          const typeStr = String(zodType)

          if (typeStr.includes('ZodNullable') || typeStr.includes('nullable')) {
            initial[fieldKey] = null
          } else if (
            typeStr.includes('ZodBoolean') ||
            typeStr.includes('boolean')
          ) {
            initial[fieldKey] = false
          } else if (
            typeStr.includes('ZodNumber') ||
            typeStr.includes('number')
          ) {
            initial[fieldKey] = 0
          } else {
            initial[fieldKey] = null
          }
        }

        return [key, initial]
      })
    )
  ) as InitialResults<T>
}

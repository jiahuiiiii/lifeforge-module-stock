import type { ReactNode } from 'react'

import { Bordered, Stack, Widget, type WidgetProps } from '@lifeforge/ui'

export default function CalculatorWrapper({
  calculatorKey,
  icon,
  color,
  children,
  result
}: {
  calculatorKey: string
  icon: string
  color: NonNullable<WidgetProps['iconColor']>
  children: ReactNode
  result?: ReactNode
}) {
  return (
    <Widget
      description={`calculators.items.${calculatorKey}.desc`}
      icon={icon}
      iconColor={color}
      title={`calculators.items.${calculatorKey}.title`}
    >
      <Stack flex="1" gap="sm">
        {children}
      </Stack>
      {result && (
        <Bordered borderSide="top" mt="md" pt="md">
          {result}
        </Bordered>
      )}
    </Widget>
  )
}

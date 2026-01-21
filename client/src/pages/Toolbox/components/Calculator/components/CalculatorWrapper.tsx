import { Widget } from 'lifeforge-ui'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export default function CalculatorWrapper({
  calculatorKey,
  icon,
  color,
  children,
  result
}: {
  calculatorKey: string
  icon: string
  color: string
  children: ReactNode
  result?: ReactNode
}) {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  return (
    <Widget
      description={t(`calculators.items.${calculatorKey}.desc`)}
      icon={icon}
      iconColor={color}
      title={t(`calculators.items.${calculatorKey}.title`)}
    >
      <div className="flex-1 space-y-3">{children}</div>
      {result && (
        <div className="border-bg-200 dark:border-bg-700 border-t pt-4">
          {result}
        </div>
      )}
    </Widget>
  )
}

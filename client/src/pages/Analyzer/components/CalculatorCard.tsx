import { Widget } from 'lifeforge-ui'
import type { ReactNode } from 'react'

interface CalculatorCardProps {
  title: string
  description?: string
  icon: string
  color: string
  children: ReactNode
  result?: ReactNode
}

export default function CalculatorCard({
  title,
  description,
  icon,
  color,
  children,
  result
}: CalculatorCardProps) {
  return (
    <Widget
      description={description}
      icon={icon}
      iconColor={color}
      title={title}
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

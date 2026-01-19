import { Icon } from '@iconify/react'
import { Card } from 'lifeforge-ui'
import type { ReactNode } from 'react'

interface CalculatorCardProps {
  title: string
  description?: string
  icon: string
  children: ReactNode
  result?: ReactNode
}

export default function CalculatorCard({
  title,
  description,
  icon,
  children,
  result
}: CalculatorCardProps) {
  return (
    <Card className="flex flex-col">
      <div className="mb-4 flex items-start gap-3">
        <div className="bg-custom-500/20 text-custom-500 flex size-10 items-center justify-center rounded-lg">
          <Icon className="size-5" icon={icon} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="text-bg-500 mt-0.5 text-sm">{description}</p>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-3">{children}</div>

      {result && (
        <div className="border-bg-200 dark:border-bg-700 mt-4 border-t pt-4">
          {result}
        </div>
      )}
    </Card>
  )
}

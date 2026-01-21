import { Card } from 'lifeforge-ui'

export default function CustomTooltip({
  active,
  payload,
  label
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!(active && payload && payload.length)) return null

  return (
    <Card className="border-bg-200 dark:border-bg-700/50 border">
      <p className="mb-2 text-sm font-semibold">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-bg-500">{entry.name}:</span>
          <span className="font-medium">
            {entry.value >= 0 ? '+' : ''}
            {entry.value.toFixed(2)}%
          </span>
        </div>
      ))}
    </Card>
  )
}

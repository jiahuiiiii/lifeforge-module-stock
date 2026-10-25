import { Box, Card, Flex, Text } from '@lifeforge/ui'

function CustomTooltip({
  active,
  payload,
  label
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <Card gap="sm">
      <Text size="sm" weight="semibold">
        {label}
      </Text>
      {payload.map((entry, index) => {
        const value = Number(entry.value)

        return (
          <Flex key={index} align="center" gap="sm">
            <Box
              flexShrink="0"
              height="0.5em"
              r="full"
              style={{ backgroundColor: entry.color }}
              width="0.5em"
            />
            <Text color="muted" size="sm">
              {entry.name}:
            </Text>
            <Text size="sm" weight="medium">
              {Number.isFinite(value) && value >= 0 ? '+' : ''}
              {Number.isFinite(value) ? value.toFixed(2) : '-'}%
            </Text>
          </Flex>
        )
      })}
    </Card>
  )
}

export default CustomTooltip

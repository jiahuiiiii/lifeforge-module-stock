import { Stack, type WidgetProps, Text, Widget } from '@lifeforge/ui'

import Formula from './Formlula'

function TermItem({
  term,
  description,
  latex,
  color,
  icon
}: {
  term: string
  description: string
  latex: string
  color: NonNullable<WidgetProps['iconColor']>
  icon: string
}) {
  return (
    <Widget icon={icon} iconColor={color} title={term}>
      <Stack gap="sm">
        <Text color="muted">{description}</Text>
        <Formula latex={latex} />
      </Stack>
    </Widget>
  )
}

export default TermItem

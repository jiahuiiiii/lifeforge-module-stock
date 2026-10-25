import { Flex, Icon } from '@lifeforge/ui'

import { MOOD_CONFIG, type Mood } from '../../../constants'

function MoodIcon({ mood }: { mood: Mood }) {
  const config = MOOD_CONFIG[mood]

  return (
    <Flex
      align="center"
      flexShrink="0"
      height="2.5em"
      justify="center"
      r="md"
      style={{ backgroundColor: `${config.color}20` }}
      width="2.5em"
    >
      <Icon icon={config.icon} style={{ color: config.color }} />
    </Flex>
  )
}

export default MoodIcon

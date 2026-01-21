import { Icon } from '@iconify/react'
import { anyColorToHex } from 'shared'

import { MOOD_CONFIG, type Mood } from '../../../constants'

function MoodIcon({ mood }: { mood: Mood }) {
  const config = MOOD_CONFIG[mood]

  return (
    <div
      className="flex size-10 items-center justify-center rounded-lg"
      style={{
        backgroundColor: anyColorToHex(config.color) + '20'
      }}
    >
      <Icon className="size-5" color={config.color} icon={config.icon} />
    </div>
  )
}

export default MoodIcon

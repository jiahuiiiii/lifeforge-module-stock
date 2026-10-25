import { Stack } from '@lifeforge/ui'

import BlindSpots from './sections/BlindSpots'
import TargetAudience from './sections/TargetAudience'

function LimitationsTab() {
  return (
    <Stack gap="lg">
      <BlindSpots />
      <TargetAudience />
    </Stack>
  )
}

export default LimitationsTab

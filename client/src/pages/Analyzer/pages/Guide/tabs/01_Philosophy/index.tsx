import { Stack } from '@lifeforge/ui'

import ColdEyePhilosophy from './sections/ColdEyePhilosophy'
import OpportunityCost from './sections/OpportunityCost'
import SleepStrategy from './sections/SleepStrategy'

function PhilosophyTab() {
  return (
    <Stack gap="lg">
      <ColdEyePhilosophy />
      <SleepStrategy />
      <OpportunityCost />
    </Stack>
  )
}

export default PhilosophyTab

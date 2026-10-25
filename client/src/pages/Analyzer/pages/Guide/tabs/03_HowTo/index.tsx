import { Stack } from '@lifeforge/ui'

import AnalysisTips from './sections/AnalysisTips'
import FindingData from './sections/FindingData'
import StepByStep from './sections/StepByStep'

function HowToTab() {
  return (
    <Stack gap="lg">
      <FindingData />
      <StepByStep />
      <AnalysisTips />
    </Stack>
  )
}

export default HowToTab

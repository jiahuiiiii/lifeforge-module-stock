import AnalysisTips from './sections/AnalysisTips'
import FindingData from './sections/FindingData'
import StepByStep from './sections/StepByStep'

function HowToTab() {
  return (
    <div className="space-y-6">
      <FindingData />
      <StepByStep />
      <AnalysisTips />
    </div>
  )
}

export default HowToTab

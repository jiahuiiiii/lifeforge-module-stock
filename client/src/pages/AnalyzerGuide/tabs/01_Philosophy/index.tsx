import ColdEyePhilosophy from './sections/ColdEyePhilosophy'
import OpportunityCost from './sections/OpportunityCost'
import SleepStrategy from './sections/SleepStrategy'

function PhilosophyTab() {
  return (
    <div className="space-y-6">
      <ColdEyePhilosophy />
      <SleepStrategy />
      <OpportunityCost />
    </div>
  )
}

export default PhilosophyTab

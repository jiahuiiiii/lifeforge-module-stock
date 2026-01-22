import { Widget } from 'lifeforge-ui'
import { usePersonalization } from 'shared'
import COLORS from 'tailwindcss/colors'

import { STEPS } from '../constants'

function StepByStep() {
  const { derivedThemeColor } = usePersonalization()

  return (
    <Widget
      icon="tabler:list-numbers"
      iconColor={COLORS.blue[500]}
      title="Step-by-Step Analysis"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(item => (
          <Widget
            key={item.step}
            className="component-bg-lighter"
            icon={item.icon}
            iconColor={derivedThemeColor}
            title={`${item.step.toString().padStart(2, '0')}. ${item.title}`}
            variant="large-icon"
          >
            <p className="text-bg-500">{item.desc}</p>
          </Widget>
        ))}
      </div>
    </Widget>
  )
}

export default StepByStep

import { Widget } from 'lifeforge-ui'
import { usePersonalization } from 'shared'
import COLORS from 'tailwindcss/colors'

import { TIPS } from '../constants'

function AnalysisTips() {
  const { derivedThemeColor } = usePersonalization()

  return (
    <Widget
      icon="tabler:bulb"
      iconColor={COLORS.yellow[500]}
      title="Tips for Better Analysis"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {TIPS.map(item => (
          <Widget
            key={item.tip}
            className="component-bg-lighter"
            icon={item.icon}
            iconColor={derivedThemeColor}
            title={<div className="text-bg-500 font-normal">{item.tip}</div>}
          />
        ))}
      </div>
    </Widget>
  )
}

export default AnalysisTips

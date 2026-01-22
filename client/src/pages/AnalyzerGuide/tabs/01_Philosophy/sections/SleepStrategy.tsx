import { Widget } from 'lifeforge-ui'
import { usePersonalization } from 'shared'
import COLORS from 'tailwindcss/colors'

import QUALITATIVE_CRITERIA from '../constants'

function SleepStrategy() {
  const { derivedThemeColor } = usePersonalization()

  return (
    <Widget
      icon="tabler:moon"
      iconColor={COLORS.purple[500]}
      title="The Sleep Strategy"
    >
      <p className="text-bg-500">
        Before analyzing any numbers, ask yourself: &quot;Can I sleep well at
        night owning this stock?&quot; This requires passing the qualitative
        gate:
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {QUALITATIVE_CRITERIA.map(item => (
          <Widget
            key={item.title}
            className="component-bg-lighter"
            description={<p className="text-base">{item.desc}</p>}
            icon={item.icon}
            iconColor={derivedThemeColor}
            title={item.title}
          />
        ))}
      </div>
    </Widget>
  )
}

export default SleepStrategy

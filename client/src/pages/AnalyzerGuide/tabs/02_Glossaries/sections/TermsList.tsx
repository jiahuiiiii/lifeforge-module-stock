import { Widget } from 'lifeforge-ui'
import COLORS from 'tailwindcss/colors'

import Formula from '../components/Formlula'
import TERMS from '../constants'

function TermsList() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {TERMS.map(item => (
        <Widget
          key={item.term}
          icon={`tabler:letter-${item.term[0].toLowerCase()}`}
          iconColor={COLORS[item.color][500]}
          title={item.term}
        >
          <p className="text-bg-500">{item.description}</p>
          <Formula latex={item.latex} />
        </Widget>
      ))}
    </div>
  )
}

export default TermsList

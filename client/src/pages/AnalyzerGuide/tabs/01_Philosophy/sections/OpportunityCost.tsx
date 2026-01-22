import { Widget } from 'lifeforge-ui'
import COLORS from 'tailwindcss/colors'

function OpportunityCost() {
  return (
    <Widget
      icon="tabler:scale"
      iconColor={COLORS.orange[500]}
      title="Opportunity Cost"
    >
      <p className="text-bg-500">
        Every investment decision has an opportunity cost. By investing in one
        stock, you forgo the returns of others. The Cold Eye method ensures you
        only invest in companies that meet high standards, reducing the chance
        of poor allocation.
      </p>
    </Widget>
  )
}

export default OpportunityCost

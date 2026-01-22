import { Card, Widget } from 'lifeforge-ui'
import COLORS from 'tailwindcss/colors'

function ColdEyePhilosophy() {
  return (
    <Widget
      icon="tabler:eye"
      iconColor={COLORS.blue[500]}
      title="The Cold Eye Philosophy"
    >
      <div>
        <p className="text-bg-500 mb-8">
          The &quot;Cold Eye&quot; approach emphasizes disciplined, emotionless
          investing based on fundamental analysis. Instead of following market
          hype or emotional decisions, investors should evaluate companies using
          quantitative metrics.
        </p>
        <h3 className="mb-4 text-xl font-semibold">Key Principles:</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="component-bg-lighter">
            <div className="mb-1 text-lg font-semibold">GDP Score</div>
            <p className="text-bg-500">
              Measures wealth creation through Growth (CAGR), Dividends, and
              Price (PE ratio)
            </p>
          </Card>
          <Card className="component-bg-lighter">
            <div className="mb-1 text-lg font-semibold">PRC Score</div>
            <p className="text-bg-500">
              Measures wealth sustainability through Profit margin, ROE, and
              Cash flow
            </p>
          </Card>
          <Card className="component-bg-lighter">
            <div className="mb-1 text-lg font-semibold">Score &gt; 100</div>
            <p className="text-bg-500">
              Minimum threshold for investment consideration (Grade A)
            </p>
          </Card>
        </div>
      </div>
    </Widget>
  )
}

export default ColdEyePhilosophy

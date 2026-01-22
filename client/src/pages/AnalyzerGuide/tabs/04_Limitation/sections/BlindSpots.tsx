import { Widget } from 'lifeforge-ui'
import COLORS from 'tailwindcss/colors'

function BlindSpots() {
  return (
    <Widget
      icon="tabler:alert-triangle"
      iconColor={COLORS.red[500]}
      title="Blind Spots & Limitations"
    >
      <Widget
        className="component-bg-lighter"
        icon="tabler:rocket-off"
        iconColor={COLORS.red[500]}
        title="Unfriendly to Tech & Growth Stocks"
      >
        <div>
          <p className="text-bg-500 mb-3">
            The current model may penalize high-growth companies unjustly:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-bg-50 dark:bg-bg-700/30 rounded p-3">
              <div className="font-semibold">Dividend Issues</div>
              <p className="text-bg-500">
                Great tech companies (like early Amazon or Tesla) often reinvest
                profits instead of paying dividends, leading to low scores.
              </p>
            </div>
            <div className="bg-bg-50 dark:bg-bg-700/30 rounded p-3">
              <div className="font-semibold">PE Ratio Issues</div>
              <p className="text-bg-500">
                Quality growth stocks often trade at PE &gt; 30x. This model
                would give them only 5 points.
              </p>
            </div>
          </div>
          <p className="text-bg-500 mt-3 border-l-2 border-red-500 pl-2 italic">
            Result: You might miss an entire tech bull run and end up only with
            traditional sectors like Banks, Real Estate, or Manufacturing.
          </p>
        </div>
      </Widget>
      <Widget
        className="component-bg-lighter"
        icon="tabler:history"
        iconColor={COLORS.orange[500]}
        title="Lagging Indicators"
      >
        <p className="text-bg-500">
          Compounded Growth (CAGR) and ROE depend on past data. A perfect past
          score doesn&apos;t guarantee future success if an industry is facing
          disruption (e.g., film cameras vs. digital). This model cannot
          evaluate future business models.
        </p>
      </Widget>
      <Widget
        className="component-bg-lighter"
        icon="tabler:coins"
        iconColor={COLORS.yellow[500]}
        title="Simplified Cash Flow"
      >
        <p className="text-bg-500">
          The model gives 40 points for &quot;Profit + Net Inflow&quot;.
          However, expanding companies may have negative cash flow due to heavy
          investment (R&D, factories). This isn&apos;t necessarily bad; it could
          be the calm before the explosion.
        </p>
      </Widget>
    </Widget>
  )
}

export default BlindSpots

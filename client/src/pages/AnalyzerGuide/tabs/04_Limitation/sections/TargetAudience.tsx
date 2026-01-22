import { Icon } from '@iconify/react'
import { Widget } from 'lifeforge-ui'
import COLORS from 'tailwindcss/colors'

function TargetAudience() {
  return (
    <Widget
      icon="tabler:users"
      iconColor={COLORS.blue[500]}
      title="Who is this for?"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon className="size-5 text-green-500" icon="tabler:check" />
            <h3 className="font-semibold text-green-700 dark:text-green-400">
              Suitable For
            </h3>
          </div>
          <ul className="text-bg-500 space-y-2">
            <li>
              • Long-term holders seeking stability (&quot;Steady
              Happiness&quot;)
            </li>
            <li>• Investors who don&apos;t want to watch the market daily</li>
            <li>
              • Identifying Blue Chips or Second-liners in traditional markets
              (e.g., Bursa Malaysia)
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon className="size-5 text-red-500" icon="tabler:x" />
            <h3 className="font-semibold text-red-700 dark:text-red-400">
              Not Suitable For
            </h3>
          </div>
          <ul className="text-bg-500 space-y-2">
            <li>• Aggressive investors targeting Tech Giants</li>
            <li>• High-growth sectors (Artificial Intelligence, Biotech)</li>
            <li>• Short-term trading or speculation</li>
          </ul>
        </div>
      </div>
      <div className="text-bg-500 flex items-start gap-2">
        <Icon className="mt-0.5 size-5" icon="tabler:book" />
        <div>
          <p className="font-semibold">
            Source: &quot;The Ultimate Stock Market Solution&quot;
          </p>
          <p>
            Core Philosophy: Value Investing, Defense & Offense. Growth as
            primary, Value as secondary.
          </p>
        </div>
      </div>
    </Widget>
  )
}

export default TargetAudience

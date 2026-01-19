import { Icon } from '@iconify/react'
import { useMemo, useState } from 'react'

import { calculatePEG } from '../../calculators'
import CalculatorCard from '../CalculatorCard'

export default function ZuluChecker() {
  const [peRatio, setPeRatio] = useState<string>('')

  const [cagr, setCagr] = useState<string>('')

  const { peg, isPass } = useMemo(() => {
    const pe = parseFloat(peRatio)

    const growth = parseFloat(cagr)

    if (isNaN(pe) || isNaN(growth) || pe <= 0 || growth <= 0) {
      return { peg: null, isPass: false }
    }

    const pegValue = calculatePEG(pe, growth)

    return { peg: pegValue, isPass: pegValue <= 1.0 }
  }, [peRatio, cagr])

  return (
    <CalculatorCard
      description="Check if PEG ratio meets Zulu Principle (PEG ≤ 1.0)"
      icon="tabler:scale"
      result={
        peg !== null && isFinite(peg) ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-bg-500 text-sm">PEG Ratio</div>
              <div className="text-2xl font-bold">{peg.toFixed(2)}</div>
            </div>
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${
                isPass
                  ? 'border-green-500/50 bg-green-500/20 text-green-500'
                  : 'border-red-500/50 bg-red-500/20 text-red-500'
              }`}
            >
              <Icon icon={isPass ? 'tabler:check' : 'tabler:x'} />
              {isPass ? 'Excellent (Zulu Pass)' : 'Overvalued'}
            </div>
          </div>
        ) : (
          <div className="text-bg-500 text-center text-sm">
            Enter values to check
          </div>
        )
      }
      title="Zulu Principle Checker"
    >
      <div>
        <label className="text-bg-500 mb-1 block text-sm">PE Ratio</label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 15"
          type="number"
          value={peRatio}
          onChange={e => setPeRatio(e.target.value)}
        />
      </div>
      <div>
        <label className="text-bg-500 mb-1 block text-sm">CAGR (%)</label>
        <input
          className="border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-900 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g., 20"
          type="number"
          value={cagr}
          onChange={e => setCagr(e.target.value)}
        />
      </div>
    </CalculatorCard>
  )
}

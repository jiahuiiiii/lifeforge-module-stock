import { Icon } from '@iconify/react'
import { NumberInput } from 'lifeforge-ui'
import { useMemo, useState } from 'react'

import { calculatePEG } from '../../calculators'
import CalculatorCard from '../CalculatorCard'

export default function ZuluChecker() {
  const [peRatio, setPeRatio] = useState(0)

  const [cagr, setCagr] = useState(0)

  const { peg, isPass } = useMemo(() => {
    if (peRatio <= 0 || cagr <= 0) {
      return { peg: null, isPass: false }
    }

    const pegValue = calculatePEG(peRatio, cagr)

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
              <div className="text-2xl font-semibold">{peg.toFixed(2)}</div>
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
      <NumberInput
        icon="tabler:percentage"
        label="PE Ratio"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 15"
        value={peRatio}
        onChange={setPeRatio}
      />
      <NumberInput
        icon="tabler:trending-up"
        label="CAGR (%)"
        namespace="apps.jiahuiiiii$stock"
        placeholder="e.g., 20"
        value={cagr}
        onChange={setCagr}
      />
    </CalculatorCard>
  )
}

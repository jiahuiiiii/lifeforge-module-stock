import { Icon } from '@iconify/react'
import z from 'zod'

import { calculatePEG } from '@/pages/Toolbox/utils/calcFuncs'

import createCalculator from '../utils/calculatorFactory'

export default createCalculator('tabler:scale')
  .fields(
    z.object({
      peRatio: z.number(),
      cagr: z.number()
    })
  )
  .config({
    peRatio: {
      type: 'number',
      icon: 'tabler:percentage',
      label: 'PE Ratio',
      placeholder: 'e.g., 15'
    },
    cagr: {
      type: 'number',
      icon: 'tabler:trending-up',
      label: 'CAGR',
      placeholder: 'e.g., 20'
    }
  })
  .result(
    z.object({
      peg: z.number().nullable(),
      isPass: z.boolean()
    })
  )
  .calculate(({ peRatio, cagr }) => {
    if (peRatio <= 0 || cagr <= 0) {
      return { peg: null, isPass: false }
    }

    const pegValue = calculatePEG(peRatio, cagr)

    return { peg: pegValue, isPass: pegValue <= 1.0 }
  })
  .displayResult(
    ({ peg, isPass }) =>
      peg !== null &&
      isFinite(peg) && (
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
      )
  )

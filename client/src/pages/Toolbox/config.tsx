import COLORS from 'tailwindcss/colors'

import cagr from './calc/cagr'
import dy from './calc/dy'
import margin from './calc/margin'
import pe from './calc/pe'
import peDiscount from './calc/peDiscount'
import peg from './calc/peg'
import ps from './calc/ps'
import roe from './calc/roe'

const CALCULATORS = [
  {
    title: 'gdp',
    color: COLORS.lime[500],
    children: { cagr, dy, pe }
  },
  {
    title: 'prc',
    color: COLORS.blue[500],
    children: { margin, roe }
  },
  {
    title: 'supplementary',
    color: COLORS.purple[500],
    children: { peg, peDiscount, ps }
  }
] as const

export default CALCULATORS

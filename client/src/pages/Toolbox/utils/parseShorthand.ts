export default function parseShorthand(value: string): number {
  if (!value) return NaN

  const cleaned = value.replace(/,/g, '').replace(/\s/g, '').toLowerCase()

  if (!cleaned) return NaN

  let isNegative = false
  let numStr = cleaned

  if (cleaned.startsWith('-')) {
    isNegative = true
    numStr = cleaned.slice(1)
  }

  const lastChar = numStr.slice(-1)

  const multipliers: Record<string, number> = {
    k: 1_000,
    m: 1_000_000,
    b: 1_000_000_000
  }

  let result: number

  if (multipliers[lastChar]) {
    const numPart = numStr.slice(0, -1)

    const num = parseFloat(numPart)

    result = isNaN(num) ? NaN : num * multipliers[lastChar]
  } else {
    result = parseFloat(numStr)
  }

  return isNegative ? -result : result
}

import { useMemo } from 'react'

function useRangeStartDate(timeRange: string) {
  const rangeStartDate = useMemo(() => {
    const now = new Date()

    const start = new Date()

    switch (timeRange) {
      case '1W':
        start.setDate(now.getDate() - 7)
        break
      case '1M':
        start.setMonth(now.getMonth() - 1)
        break
      case '3M':
        start.setMonth(now.getMonth() - 3)
        break
      case 'YTD':
        start.setMonth(0, 1) // Jan 1st of current year
        break
      case '1Y':
        start.setFullYear(now.getFullYear() - 1)
        break
      case 'ALL':
        return null // No start date filter
      default:
        start.setMonth(now.getMonth() - 1)
    }

    return start.toISOString().split('T')[0]
  }, [timeRange])

  return rangeStartDate
}

export default useRangeStartDate

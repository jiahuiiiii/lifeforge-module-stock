import dayjs from 'dayjs'
import { useMemo } from 'react'

function useRangeStartDate(timeRange: string) {
  return useMemo(() => {
    const now = dayjs()

    switch (timeRange) {
      case '1W':
        return now.subtract(7, 'day').format('YYYY-MM-DD')
      case '1M':
        return now.subtract(1, 'month').format('YYYY-MM-DD')
      case '3M':
        return now.subtract(3, 'month').format('YYYY-MM-DD')
      case 'YTD':
        return now.startOf('year').format('YYYY-MM-DD')
      case '1Y':
        return now.subtract(1, 'year').format('YYYY-MM-DD')
      case 'ALL':
        return null
      default:
        return now.subtract(1, 'month').format('YYYY-MM-DD')
    }
  }, [timeRange])
}

export default useRangeStartDate

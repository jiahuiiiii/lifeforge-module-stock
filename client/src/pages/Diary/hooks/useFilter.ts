import { parseAsString, parseAsStringEnum, useQueryState } from 'shared'

import { MOODS } from '../constants'

export default function useFilter() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  const [filterMood, setFilterMood] = useQueryState(
    'mood',
    parseAsStringEnum([...MOODS, 'all']).withDefault('all')
  )

  return {
    searchQuery,
    setSearchQuery,
    filterMood,
    setFilterMood
  }
}

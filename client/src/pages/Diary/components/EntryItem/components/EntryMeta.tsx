import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import type { DiaryEntry } from '../../..'
import { MOOD_CONFIG } from '../../../constants'

function EntryMeta({ entry }: { entry: DiaryEntry }) {
  const { t } = useTranslation('apps.jiahuiiiii$stock')

  const config = MOOD_CONFIG[entry.feel]

  return (
    <div>
      <h3 className="font-semibold">{entry.title}</h3>
      <div className="text-bg-500 flex items-center gap-2 text-sm">
        <span>{dayjs(entry.date).format('MMM D, YYYY')}</span>
        <span>•</span>
        <span style={{ color: config.color }}>{t(config.labelKey)}</span>
      </div>
    </div>
  )
}

export default EntryMeta

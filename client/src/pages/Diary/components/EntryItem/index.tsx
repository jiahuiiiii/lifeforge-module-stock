import { Card } from 'lifeforge-ui'

import forgeAPI from '@/utils/forgeAPI'

import type { DiaryEntry } from '../..'
import ActionMenu from './components/ActionMenu'
import EntryMeta from './components/EntryMeta'
import MoodIcon from './components/MoodIcon'

function EntryItem({ entry }: { entry: DiaryEntry }) {
  return (
    <Card className="group space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <MoodIcon mood={entry.feel} />
          <EntryMeta entry={entry} />
        </div>
        <ActionMenu entry={entry} />
      </div>
      {entry.notes && (
        <p className="text-bg-500 whitespace-pre-wrap">{entry.notes}</p>
      )}
      {entry.image && (
        <img
          alt=""
          className="w-full rounded-lg object-cover"
          src={forgeAPI.getMedia({
            collectionId: entry.collectionId,
            recordId: entry.id,
            fieldId: entry.image
          })}
        />
      )}
    </Card>
  )
}

export default EntryItem

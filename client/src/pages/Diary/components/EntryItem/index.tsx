import { Box, Card, Flex, Stack, Text } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { DiaryEntry } from '../..'
import ActionMenu from './components/ActionMenu'
import EntryMeta from './components/EntryMeta'
import MoodIcon from './components/MoodIcon'

function EntryItem({ entry }: { entry: DiaryEntry }) {
  return (
    <Card gap="md">
      <Flex align="start" gap="sm" justify="between">
        <Flex align="center" gap="sm">
          <MoodIcon mood={entry.feel} />
          <EntryMeta entry={entry} />
        </Flex>
        <ActionMenu entry={entry} />
      </Flex>
      {entry.notes && (
        <Stack>
          <Text color="muted" whiteSpace="pre-wrap">
            {entry.notes}
          </Text>
        </Stack>
      )}
      {entry.image && (
        <Box
          alt=""
          as="img"
          r="lg"
          src={forgeAPI.getMedia({ key: entry.image })}
          style={{ objectFit: 'cover', width: '100%' }}
        />
      )}
    </Card>
  )
}

export default EntryItem

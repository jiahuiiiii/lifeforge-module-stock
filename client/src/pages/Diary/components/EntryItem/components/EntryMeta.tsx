import dayjs from 'dayjs'

import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Stack, Text } from '@lifeforge/ui'

import type { DiaryEntry } from '../../..'
import { MOOD_CONFIG } from '../../../constants'

function EntryMeta({ entry }: { entry: DiaryEntry }) {
  const { t } = useModuleTranslation()

  const config = MOOD_CONFIG[entry.feel]

  return (
    <Stack gap="xs" minWidth="0">
      <Text weight="semibold">{entry.title}</Text>
      <Flex align="center" gap="sm">
        <Text color="muted" size="sm">
          {dayjs(entry.date).format('MMM D, YYYY')}
        </Text>
        <Text color="muted" size="sm">
          •
        </Text>
        <Text size="sm" style={{ color: config.color }}>
          {t(config.labelKey)}
        </Text>
      </Flex>
    </Stack>
  )
}

export default EntryMeta

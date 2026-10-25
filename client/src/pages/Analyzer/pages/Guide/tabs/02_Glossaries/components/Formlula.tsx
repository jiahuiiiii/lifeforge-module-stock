import katex from 'katex'

import { Box, Card, surface } from '@lifeforge/ui'

function Formula({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: false
  })

  return (
    <Card align="center" bg={surface.light} justify="center">
      <Box
        as="span"
        dangerouslySetInnerHTML={{ __html: html }}
        display="inline-block"
      />
    </Card>
  )
}

export default Formula

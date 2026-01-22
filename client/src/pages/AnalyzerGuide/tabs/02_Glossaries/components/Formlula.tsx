import katex from 'katex'

function Formula({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: false
  })

  return (
    <div className="bg-bg-100 dark:bg-bg-800/50 flex items-center justify-center rounded-lg px-4 py-3">
      <span
        className="inline-block"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

export default Formula

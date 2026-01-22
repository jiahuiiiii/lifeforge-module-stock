import TermItem from './components/TermItem'
import TERMS from './constants'

function GlossaryTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {TERMS.map(item => (
        <TermItem
          key={item.term}
          color={item.color}
          description={item.description}
          latex={item.latex}
          term={item.term}
        />
      ))}
    </div>
  )
}

export default GlossaryTab

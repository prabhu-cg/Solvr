import type { DocBlock } from '@/lib/doc-blocks'

/** Block text uses markdown's `**bold**` for emphasis (matching the Markdown exporter) — turn that into <strong> here since JSX won't interpret it on its own. */
function renderInline(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))
}

/** Renders the same DocBlock[] the Markdown exporter consumes — used by the print view so both stay in sync. */
export function DocBlocksView({ blocks }: { blocks: DocBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading': {
            const Tag = (`h${block.level}` as 'h1' | 'h2' | 'h3')
            return (
              <Tag key={i} className={block.level === 1 ? 'doc-h1' : block.level === 2 ? 'doc-h2' : 'doc-h3'}>
                {block.text}
              </Tag>
            )
          }
          case 'paragraph':
            return (
              <p key={i} className="doc-p">
                {renderInline(block.text)}
              </p>
            )
          case 'list':
            return block.items.length === 0 ? (
              <p key={i} className="doc-empty">
                None.
              </p>
            ) : (
              <ul key={i} className="doc-list">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            )
          case 'keyValue':
            return block.pairs.length === 0 ? (
              <p key={i} className="doc-empty">
                None.
              </p>
            ) : (
              <dl key={i} className="doc-kv">
                {block.pairs.map((pair, j) => (
                  <div key={j} className="doc-kv-row">
                    <dt>{pair.label}</dt>
                    <dd>{renderInline(pair.value)}</dd>
                  </div>
                ))}
              </dl>
            )
          case 'table':
            return (
              <table key={i} className="doc-table">
                <thead>
                  <tr>
                    {block.headers.map((h, j) => (
                      <th key={j}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, j) => (
                    <tr key={j}>
                      {row.map((cell, k) => (
                        <td key={k}>{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          case 'note':
            return (
              <p key={i} className="doc-note">
                {renderInline(block.text)}
              </p>
            )
          default:
            return null
        }
      })}
    </>
  )
}

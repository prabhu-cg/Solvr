/**
 * A tiny generic document format. `compileProjectDocument` (project-document.ts)
 * walks the whole project once into an array of these blocks; both the
 * Markdown exporter and the print view render from that same array, so
 * "what the export contains" and "what print shows" can never drift apart.
 */
export type DocBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'keyValue'; pairs: { label: string; value: string }[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'note'; text: string }

export function heading(level: 1 | 2 | 3, text: string): DocBlock {
  return { type: 'heading', level, text }
}
export function paragraph(text: string): DocBlock {
  return { type: 'paragraph', text }
}
export function list(items: string[]): DocBlock {
  return { type: 'list', items }
}
export function keyValue(pairs: { label: string; value: string }[]): DocBlock {
  return { type: 'keyValue', pairs: pairs.filter((p) => p.value?.trim()) }
}
export function table(headers: string[], rows: string[][]): DocBlock {
  return { type: 'table', headers, rows }
}
export function note(text: string): DocBlock {
  return { type: 'note', text }
}

export const NOT_GENERATED_NOTE = 'Not yet generated.'

function escapeMdCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

export function blocksToMarkdown(blocks: DocBlock[]): string {
  const lines: string[] = []
  for (const block of blocks) {
    switch (block.type) {
      case 'heading':
        lines.push(`${'#'.repeat(block.level)} ${block.text}`, '')
        break
      case 'paragraph':
        lines.push(block.text, '')
        break
      case 'list':
        if (block.items.length === 0) {
          lines.push('_None._', '')
        } else {
          for (const item of block.items) lines.push(`- ${item}`)
          lines.push('')
        }
        break
      case 'keyValue':
        if (block.pairs.length === 0) {
          lines.push('_None._', '')
        } else {
          for (const pair of block.pairs) lines.push(`- **${pair.label}:** ${pair.value}`)
          lines.push('')
        }
        break
      case 'table':
        lines.push(`| ${block.headers.join(' | ')} |`)
        lines.push(`| ${block.headers.map(() => '---').join(' | ')} |`)
        for (const row of block.rows) lines.push(`| ${row.map(escapeMdCell).join(' | ')} |`)
        lines.push('')
        break
      case 'note':
        lines.push(`> ${block.text}`, '')
        break
    }
  }
  return lines.join('\n').trim() + '\n'
}

import { Download, FileText, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { blocksToMarkdown } from '@/lib/doc-blocks'
import { compileProjectDocument } from '@/lib/project-document'
import type { Project } from '@/data/models'

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'solvr-project'
  )
}

function downloadMarkdown(project: Project) {
  const markdown = blocksToMarkdown(compileProjectDocument(project))
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${slugify(project.name)}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** Export → Markdown / Print-PDF (Sections 10-11). Markdown is generated and downloaded entirely client-side — no server round trip, no PDF service. */
export function ExportMenu({ project }: { project: Project }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Download className="size-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => downloadMarkdown(project)}>
          <FileText className="size-4" />
          Markdown
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/app/projects/${project.id}/print`} target="_blank" rel="noopener noreferrer">
            <Printer className="size-4" />
            Print / PDF
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

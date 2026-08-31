import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DocBlocksView } from '@/components/app/doc-blocks-view'
import { Button } from '@/components/ui/button'
import type { Project } from '@/data/models'
import { compileProjectDocument } from '@/lib/project-document'
import { projectRepository } from '@/repositories'

/**
 * A clean browser print/PDF view — no app chrome, no complex PDF service.
 * Standalone (not nested in ProjectWorkspaceLayout) so nothing but the
 * document itself ever renders here (Section 11).
 */
export function PrintPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [project, setProject] = useState<Project | null | undefined>(undefined)

  useEffect(() => {
    if (!projectId) return
    projectRepository.getProject(projectId).then((p) => setProject(p ?? null))
  }, [projectId])

  if (project === undefined) {
    return <p className="p-8 text-sm text-muted-foreground">Loading…</p>
  }
  if (project === null) {
    return <p className="p-8 text-sm text-muted-foreground">Project not found.</p>
  }

  const blocks = compileProjectDocument(project)

  return (
    <div className="print-page">
      <style>{`
        .print-page {
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 24px 96px;
          font-family: var(--font-sans, system-ui, sans-serif);
          color: #18181b;
          background: #fff;
        }
        .print-toolbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          justify-content: flex-end;
          padding: 12px 0 24px;
          background: #fff;
        }
        .doc-h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 4px; }
        .doc-h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin: 40px 0 4px; border-top: 1px solid #e4e3ec; padding-top: 24px; }
        .doc-h3 { font-size: 15px; font-weight: 700; margin: 20px 0 6px; color: #362fa3; }
        .doc-p { font-size: 13px; line-height: 1.6; margin: 0 0 8px; color: #18181b; }
        .doc-empty { font-size: 13px; color: #6f6f78; font-style: italic; margin: 0 0 8px; }
        .doc-list { margin: 0 0 10px; padding-left: 20px; font-size: 13px; line-height: 1.6; }
        .doc-list li { margin-bottom: 2px; }
        .doc-kv { margin: 0 0 10px; }
        .doc-kv-row { display: flex; gap: 8px; font-size: 13px; line-height: 1.6; margin-bottom: 2px; }
        .doc-kv-row dt { font-weight: 700; flex-shrink: 0; }
        .doc-kv-row dd { margin: 0; color: #333; }
        .doc-table { width: 100%; border-collapse: collapse; margin: 0 0 12px; font-size: 12px; }
        .doc-table th, .doc-table td { border: 1px solid #e4e3ec; padding: 6px 8px; text-align: left; vertical-align: top; }
        .doc-table th { background: #f4f4f6; font-weight: 700; }
        .doc-note { font-size: 12px; font-style: italic; color: #8a5a00; background: #fdf3e3; border-radius: 6px; padding: 8px 10px; margin: 0 0 10px; }

        @media print {
          .print-toolbar { display: none; }
          .print-page { padding: 0; max-width: none; }
          .doc-h2 { break-before: page; }
          .doc-table, .doc-list, .doc-kv { break-inside: avoid; }
          @page { margin: 20mm 16mm; }
        }
      `}</style>

      <div className="print-toolbar">
        <Button onClick={() => window.print()}>
          <Printer className="size-4" />
          Print / Save as PDF
        </Button>
      </div>

      <DocBlocksView blocks={blocks} />
    </div>
  )
}

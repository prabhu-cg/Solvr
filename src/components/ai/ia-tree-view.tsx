import { File, FolderTree, Layers } from 'lucide-react'
import type { IAProductArea } from '@/ai/schemas'

export function IATreeView({ nodes }: { nodes: IAProductArea[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {nodes.map((area, i) => (
        <li key={i}>
          <div className="flex items-center gap-2 text-sm">
            <Layers className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <span className="font-bold text-foreground">{area.label}</span>
            <span className="text-xs text-muted-foreground">product area</span>
          </div>
          <ul className="ml-5 mt-1 flex flex-col gap-1 border-l border-border pl-4">
            {area.sections.map((section, j) => (
              <li key={j}>
                <div className="flex items-center gap-2 text-sm">
                  <FolderTree className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="text-foreground">{section.label}</span>
                  <span className="text-xs text-muted-foreground">section</span>
                </div>
                <ul className="ml-5 mt-1 flex flex-col gap-1 border-l border-border pl-4">
                  {section.pages.map((page, k) => (
                    <li key={k} className="flex items-center gap-2 text-sm">
                      <File className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="text-foreground">{page.label}</span>
                      <span className="text-xs text-muted-foreground">page</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

import { CheckCircle2, Circle, FileSearch, Lightbulb, Target, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

const STAGES = [
  { label: 'Project Setup', status: 'Completed', icon: CheckCircle2, done: true },
  { label: '01  Discover', status: 'In progress', icon: FileSearch, done: false, active: true },
  { label: '02  Define', status: 'Not started', icon: Target, done: false },
  { label: '03  Ideate', status: 'Not started', icon: Lightbulb, done: false },
  { label: '04  Solution', status: 'Not started', icon: Wrench, done: false },
]

/** A restrained, static representation of the Solvr workspace — no imagery, just the real UI language. */
export function AppPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
        <span className="size-2.5 rounded-full bg-border-strong" />
        <span className="size-2.5 rounded-full bg-border-strong" />
        <span className="size-2.5 rounded-full bg-border-strong" />
        <span className="ml-3 rounded-md bg-card px-2.5 py-1 text-xs text-muted-foreground">
          Council Parking Permit Application
        </span>
      </div>

      <div className="flex">
        <aside className="hidden w-48 shrink-0 border-r border-border p-3 sm:block">
          <ul className="flex flex-col gap-1">
            {STAGES.map((stage) => (
              <li
                key={stage.label}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold',
                  stage.active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                )}
              >
                <stage.icon className={cn('size-3.5 shrink-0', stage.done && 'text-success')} />
                <span className="flex-1">{stage.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">Discover</p>
              <p className="text-xs text-muted-foreground">Understand the problem before you answer it.</p>
            </div>
            <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              In progress
            </span>
          </div>

          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/5 rounded-full bg-primary" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-3">
              <p className="mb-1.5 text-xs font-bold text-foreground">Evidence gathered</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Circle className="size-3 fill-success text-success" />
                Call centre notes
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Circle className="size-3 fill-warning text-warning" />
                User interviews — missing
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="mb-1.5 text-xs font-bold text-foreground">Open gaps</p>
              <p className="text-xs text-muted-foreground">No research on low digital-confidence residents yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

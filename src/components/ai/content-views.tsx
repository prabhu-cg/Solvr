import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

export function ListView({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">None.</p>
  return (
    <ul className="flex flex-col gap-2 text-sm text-foreground">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50" aria-hidden />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function FieldView({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 p-3.5">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  )
}

export function FieldListView({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-lg bg-muted/60 p-3.5">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1.5">
        <ListView items={items} />
      </div>
    </div>
  )
}

export function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function ViewGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>
}

export function EditStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>
}

/** A dashed-border placeholder used to gate a tab behind a prerequisite — e.g. "add evidence before generating analysis". */
export function EmptyTabState({ icon: Icon, message }: { icon: LucideIcon; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-strong bg-muted/40 p-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-xs">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

export function ListView({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">None.</p>
  return (
    <ul className="flex flex-col gap-1.5 text-sm text-foreground">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-muted-foreground" aria-hidden>
            &bull;
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function FieldView({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  )
}

export function FieldListView({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1">
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
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>
}

export function EditStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>
}

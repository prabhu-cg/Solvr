import { Check, Loader } from 'lucide-react'
import type { SaveStatus } from '@/store/useProjectStore'
import { cn } from '@/lib/utils'

export function SaveIndicator({ status, className }: { status: SaveStatus; className?: string }) {
  if (status === 'idle') return null

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground', className)}
    >
      {status === 'saving' ? (
        <>
          <Loader className="size-3.5 animate-spin" aria-hidden />
          Saving…
        </>
      ) : (
        <>
          <Check className="size-3.5 text-success" aria-hidden />
          Saved
        </>
      )}
    </span>
  )
}

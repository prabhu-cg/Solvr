import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'solvr-theme'

/**
 * Light or dark — nothing else (no "system" option). The choice lives on
 * <html class="dark"> and in localStorage; index.html applies it before first
 * paint. Both icons are always rendered and swapped with CSS so there's no
 * flash and no state to hydrate.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement
    const next = root.classList.contains('dark') ? 'light' : 'dark'
    root.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode / blocked storage: the toggle still works for this page view.
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle light and dark mode"
      onClick={toggle}
      className={cn('text-muted-foreground hover:text-foreground', className)}
    >
      <Moon className="size-4 dark:hidden" aria-hidden />
      <Sun className="hidden size-4 dark:block" aria-hidden />
    </Button>
  )
}

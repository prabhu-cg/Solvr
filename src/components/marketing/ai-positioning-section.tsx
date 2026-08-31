import { AlertTriangle, MessageSquareWarning, Sparkles } from 'lucide-react'
import { Container } from '@/components/marketing/container'

export function AIPositioningSection() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-t border-border py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">
              More than a generator. A design partner.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Solvr doesn’t simply generate UX documents. It looks for gaps, challenges
              assumptions and helps you decide what needs to happen next.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Looks for gaps</p>
                <p className="text-sm text-muted-foreground">Flags what’s missing before it becomes a costly assumption.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <MessageSquareWarning className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Challenges assumptions</p>
                <p className="text-sm text-muted-foreground">Pushes back rather than accepting the first framing of a problem.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">Names what’s next</p>
                <p className="text-sm text-muted-foreground">Helps you decide what needs to happen before you move forward.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

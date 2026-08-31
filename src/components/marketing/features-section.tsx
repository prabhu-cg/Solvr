import { Compass, GitCompareArrows, ShieldCheck, Sparkles, SplitSquareHorizontal, Waypoints } from 'lucide-react'
import { Container } from '@/components/marketing/container'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI at every step',
    description: 'Every stage is backed by AI that drafts, critiques and scores readiness — not just a single generate button.',
  },
  {
    icon: Compass,
    title: 'Guided process',
    description: 'Solvr guides you through the design process instead of expecting you to know the methodology.',
  },
  {
    icon: ShieldCheck,
    title: 'Evidence-aware',
    description: 'Separate evidence, assumptions, inferences and recommendations.',
  },
  {
    icon: Waypoints,
    title: 'Stage readiness',
    description: 'Understand what is known, what is missing and whether you’re ready to move forward.',
  },
  {
    icon: SplitSquareHorizontal,
    title: 'Explore before deciding',
    description: 'Generate and compare multiple solution concepts.',
  },
  {
    icon: GitCompareArrows,
    title: 'Structured outputs',
    description: 'Turn your thinking into practical UX and product deliverables.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-border bg-secondary py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-primary-text">Features</p>
          <h2 className="mt-2 text-balance text-3xl font-extrabold sm:text-4xl">
            Everything a structured design process needs.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-lg border border-border bg-card p-5">
              <span className="mb-4 flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <feature.icon className="size-5" />
              </span>
              <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

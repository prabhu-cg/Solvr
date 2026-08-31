import { FileSearch, Lightbulb, ListChecks, Target, Wrench } from 'lucide-react'
import { Container } from '@/components/marketing/container'

const STEPS = [
  {
    number: '01',
    icon: ListChecks,
    title: 'Project Setup',
    description: 'Capture the problem, the product, who it affects and what the business wants — the foundation everything else builds on.',
  },
  {
    number: '02',
    icon: FileSearch,
    title: 'Discover',
    description: 'Understand the problem space. Bring in evidence, surface assumptions, and see what you still don’t know.',
  },
  {
    number: '03',
    icon: Target,
    title: 'Define',
    description: 'Turn what you discovered into a sharp, agreed opportunity that’s actually worth solving.',
  },
  {
    number: '04',
    icon: Lightbulb,
    title: 'Ideate',
    description: 'Explore multiple solution concepts and compare them before committing to a direction.',
  },
  {
    number: '05',
    icon: Wrench,
    title: 'Solution',
    description: 'Develop the strongest concept into a practical, structured product and UX specification.',
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="scroll-mt-16 border-t border-border py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-primary-text">
            Design Process
          </p>
          <h2 className="mt-2 text-balance text-3xl font-extrabold sm:text-4xl">
            From problem to solution, one step at a time.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step) => (
            <div key={step.number} className="relative rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <step.icon className="size-5" />
                </span>
                <span className="text-xs font-bold text-muted-foreground">{step.number}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

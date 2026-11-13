import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/marketing/container'
import { LaptopMockup } from '@/components/marketing/laptop-mockup'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <Container className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-3 py-1 text-xs font-semibold text-primary-text">
            AI-guided product design
          </span>

          <h1 className="mt-6 text-balance text-5xl leading-none text-foreground sm:text-7xl">
            Think through. <span className="text-primary-text">Design better.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            Solvr guides you from a product problem to a validated design solution — helping you
            understand the problem, define the opportunity, explore solutions, turn the
            strongest direction into a practical specification, then test it and iterate on what
            you learn.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link to="/app">
                Start designing — free
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#process">See how it works</a>
            </Button>
          </div>
        </div>

        <LaptopMockup
          lightSrc="/mockups/workspace-light-v1.png"
          darkSrc="/mockups/workspace-dark-v1.png"
          alt="The Solvr workspace showing the Discover stage of a project, with a readiness check surfacing strengths, gaps and critical assumptions alongside the Discover through Iterate stage navigation."
          width={2880}
          height={1800}
        />
      </Container>
    </section>
  )
}

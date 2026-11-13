import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="border-t border-border bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-3xl text-foreground sm:text-4xl">
          Have a problem worth solving?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
          Start with the problem. Solvr will help you think through the rest.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link to="/app">
            Start designing — free
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  )
}

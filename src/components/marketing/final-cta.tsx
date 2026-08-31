import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function FinalCTA() {
  return (
    <section className="bg-primary py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-balance text-3xl font-extrabold text-primary-foreground sm:text-4xl">
          Have a problem worth solving?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-primary-foreground/80">
          Start with the problem. Solvr will help you think through the rest.
        </p>
        <Link
          to="/app"
          className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-background px-8 text-base font-semibold text-foreground transition-all duration-150 hover:bg-secondary active:scale-[0.98]"
        >
          Start designing — free
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}

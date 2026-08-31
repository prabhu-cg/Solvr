import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <Link to="/" aria-label="Solvr home">
          <Logo withTagline />
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Solvr. Think through. Design better.
        </p>
      </div>
    </footer>
  )
}

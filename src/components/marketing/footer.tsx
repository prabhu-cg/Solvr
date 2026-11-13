import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'

const LINK = 'text-sm text-muted-foreground transition-colors hover:text-foreground'
const LEGAL_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <Link to="/" aria-label="Solvr home">
          <Logo />
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Solvr. Think through. Design better.
        </p>
        <nav aria-label="Legal" className="flex items-center gap-5">
          {LEGAL_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={LINK}>
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/prabhu-cg/Solvr"
            target="_blank"
            rel="noreferrer"
            className={LINK}
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}

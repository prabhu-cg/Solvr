import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/logo'
import { AboutDialog, PrivacyDialog, TermsDialog } from '@/components/marketing/footer-legal'

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
          <AboutDialog />
          <PrivacyDialog />
          <TermsDialog />
          <a
            href="https://github.com/prabhu-cg/Solvr"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}

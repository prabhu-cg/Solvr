import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AboutPage, PrivacyPage, TermsPage } from '@/pages/legal-pages'
import { DefinePage } from '@/pages/define-page'
import { DiscoverPage } from '@/pages/discover-page'
import { IdeatePage } from '@/pages/ideate-page'
import { IteratePage } from '@/pages/iterate-page'
import { MarketingPage } from '@/pages/marketing-page'
import { PrintPage } from '@/pages/print-page'
import { ProjectSetupPage } from '@/pages/project-setup-page'
import { ProjectWorkspaceLayout } from '@/pages/project-workspace-layout'
import { ProjectsListPage } from '@/pages/projects-list-page'
import { SolutionPage } from '@/pages/solution-page'
import { ValidatePage } from '@/pages/validate-page'

/** Route changes keep the previous scroll position by default; new pages should start at the top (hash links excepted). */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<MarketingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      <Route path="/app" element={<ProjectsListPage />} />
      <Route path="/app/new" element={<Navigate to="/app" replace />} />

      {/* Standalone — no app shell chrome, so the print view is clean (Section 11). */}
      <Route path="/app/projects/:projectId/print" element={<PrintPage />} />

      <Route path="/app/projects/:projectId" element={<ProjectWorkspaceLayout />}>
        <Route index element={<Navigate to="setup" replace />} />
        <Route path="setup" element={<ProjectSetupPage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="define" element={<DefinePage />} />
        <Route path="ideate" element={<IdeatePage />} />
        <Route path="solution" element={<SolutionPage />} />
        <Route path="validate" element={<ValidatePage />} />
        <Route path="iterate" element={<IteratePage />} />
        <Route path="*" element={<Navigate to="setup" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

export default App

import { Navigate, Route, Routes } from 'react-router-dom'
import { DefinePage } from '@/pages/define-page'
import { DiscoverPage } from '@/pages/discover-page'
import { IdeatePage } from '@/pages/ideate-page'
import { MarketingPage } from '@/pages/marketing-page'
import { PrintPage } from '@/pages/print-page'
import { ProjectSetupPage } from '@/pages/project-setup-page'
import { ProjectWorkspaceLayout } from '@/pages/project-workspace-layout'
import { ProjectsListPage } from '@/pages/projects-list-page'
import { SolutionPage } from '@/pages/solution-page'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingPage />} />

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
        <Route path="*" element={<Navigate to="setup" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

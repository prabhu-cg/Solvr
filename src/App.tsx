import { Navigate, Route, Routes } from 'react-router-dom'
import { DefinePage } from '@/pages/define-page'
import { DiscoverPage } from '@/pages/discover-page'
import { MarketingPage } from '@/pages/marketing-page'
import { ProjectSetupPage } from '@/pages/project-setup-page'
import { ProjectWorkspaceLayout } from '@/pages/project-workspace-layout'
import { ProjectsListPage } from '@/pages/projects-list-page'
import { StagePlaceholderPage } from '@/pages/stage-placeholder-page'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingPage />} />

      <Route path="/app" element={<ProjectsListPage />} />
      <Route path="/app/new" element={<Navigate to="/app" replace />} />

      <Route path="/app/projects/:projectId" element={<ProjectWorkspaceLayout />}>
        <Route index element={<Navigate to="setup" replace />} />
        <Route path="setup" element={<ProjectSetupPage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="define" element={<DefinePage />} />
        <Route path="ideate" element={<StagePlaceholderPage stage="ideate" />} />
        <Route path="solution" element={<StagePlaceholderPage stage="solution" />} />
        <Route path="*" element={<Navigate to="setup" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

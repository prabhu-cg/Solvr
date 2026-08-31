import { Navigate, Route, Routes } from 'react-router-dom'
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
        <Route path=":stage" element={<StagePlaceholderPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

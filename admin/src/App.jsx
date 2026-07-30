import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout      from './components/AdminLayout.jsx'
import ProtectedRoute   from './components/ProtectedRoute.jsx'
import FaviconUpdater   from './components/FaviconUpdater.jsx'
import Login            from './pages/Login.jsx'
import Dashboard        from './pages/Dashboard.jsx'
import ProfileManager   from './pages/ProfileManager.jsx'
import SkillsManager    from './pages/SkillsManager.jsx'
import ProjectsManager  from './pages/ProjectsManager.jsx'
import ExperienceManager from './pages/ExperienceManager.jsx'
import EducationManager from './pages/EducationManager.jsx'
import CertificatesManager from './pages/CertificatesManager.jsx'
import BlogManager      from './pages/BlogManager.jsx'
import MediaLibrary     from './pages/MediaLibrary.jsx'
import ContactInbox     from './pages/ContactInbox.jsx'
import Analytics        from './pages/Analytics.jsx'
import SettingsManager  from './pages/SettingsManager.jsx'
import AuditLog         from './pages/AuditLog.jsx'
import AccountSettings  from './pages/AccountSettings.jsx'

export default function App() {
  return (
    <>
      <FaviconUpdater />
      <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected admin routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"    element={<Dashboard />} />
        <Route path="profile"      element={<ProfileManager />} />
        <Route path="skills"       element={<SkillsManager />} />
        <Route path="projects"     element={<ProjectsManager />} />
        <Route path="experience"   element={<ExperienceManager />} />
        <Route path="education"    element={<EducationManager />} />
        <Route path="certificates" element={<CertificatesManager />} />
        <Route path="blog"         element={<BlogManager />} />
        <Route path="media"        element={<MediaLibrary />} />
        <Route path="contact"      element={<ContactInbox />} />
        <Route path="analytics"    element={<Analytics />} />
        <Route path="settings"     element={<SettingsManager />} />
        <Route path="audit-log"    element={<AuditLog />} />
        <Route path="account"      element={<AccountSettings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </>
  )
}

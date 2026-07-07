import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { LandingPage } from './pages/design/LandingPage';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailPage } from './pages/ProjectDetail';
import { AboutPage } from './pages/About';
import { ContactsPage } from './pages/Contacts';
import { NotFoundPage } from './pages/NotFound';
import { HelmetProvider } from './utils/HelmetProvider';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLoginPage } from './pages/admin/Login';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminProjectsPage } from './pages/admin/ProjectsList';
import { AdminProjectFormPage } from './pages/admin/ProjectForm';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* New design landing — self-contained, own header/footer */}
            <Route index element={<LandingPage />} />

            {/* Old public sub-pages — keep old Layout for now */}
            <Route element={<Layout />}>
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:id" element={<ProjectDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminProjectsPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="projects/new" element={<AdminProjectFormPage />} />
              <Route path="projects/:id" element={<AdminProjectFormPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

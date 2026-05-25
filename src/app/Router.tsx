import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';

// Public pages
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import SDGDashboardPage from '../pages/SDGDashboardPage';
import ParticipationPage from '../pages/ParticipationPage';
import EventsPage from '../pages/EventsPage';
import TransparencyPage from '../pages/TransparencyPage';
import RoadmapPage from '../pages/RoadmapPage';
import AudiencesPage from '../pages/AudiencesPage';
import RewardsPage from '../pages/RewardsPage';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// User pages (protected)
import DashboardPage from '../pages/user/DashboardPage';
import ProfilePage from '../pages/user/ProfilePage';
import UserRewardsPage from '../pages/user/UserRewardsPage';

// Admin pages (admin-only)
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageProjectsPage from '../pages/admin/ManageProjectsPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import NewProjectPage from '../pages/admin/NewProjectPage';
import EditProjectPage from '../pages/admin/EditProjectPage';
import AccessibilityPage from '../pages/AccessibilityPage';
import PrivacyPage from '../pages/PrivacyPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public
      { index: true, element: <LandingPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: 'sdg-dashboard', element: <SDGDashboardPage /> },
      { path: 'participate', element: <ParticipationPage /> },
      { path: 'audiences', element: <AudiencesPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'transparency', element: <TransparencyPage /> },
      { path: 'roadmap', element: <RoadmapPage /> },
      { path: 'rewards', element: <RewardsPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
      { path: 'privacy', element: <PrivacyPage /> },

      // Auth
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },

      // Protected (user)
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-rewards',
        element: (
          <ProtectedRoute>
            <UserRewardsPage />
          </ProtectedRoute>
        ),
      },

      // Admin
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/projects',
        element: (
          <AdminRoute>
            <ManageProjectsPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <ManageUsersPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/projects/new',
        element: (
          <AdminRoute>
            <NewProjectPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/projects/:id/edit',
        element: (
          <AdminRoute>
            <EditProjectPage />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

import { useEffect, useState, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';
import { initAuth } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

// Page components are code-split via React.lazy so each route ships its own
// chunk instead of one ~1.3 MB bundle (Future_Work §6.6). The Suspense boundary
// lives in Layout, around <Outlet>. The shell — Layout, route guards, the error
// element and the 404 page — stays eager so navigation and error handling never
// wait on a chunk.
// Public pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'));
const SDGDashboardPage = lazy(() => import('../pages/SDGDashboardPage'));
const ParticipationPage = lazy(() => import('../pages/ParticipationPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const EventDetailPage = lazy(() => import('../pages/EventDetailPage'));
const TransparencyPage = lazy(() => import('../pages/TransparencyPage'));
const AudiencesPage = lazy(() => import('../pages/AudiencesPage'));
const RewardsPage = lazy(() => import('../pages/RewardsPage'));
const GetInvolvedPage = lazy(() => import('../pages/GetInvolvedPage'));
const IdeasPage = lazy(() => import('../pages/IdeasPage'));
const IdeaDetailPage = lazy(() => import('../pages/IdeaDetailPage'));
const LearnPage = lazy(() => import('../pages/LearnPage'));
const LearnDetailPage = lazy(() => import('../pages/LearnDetailPage'));
const NewsPage = lazy(() => import('../pages/NewsPage'));
const NewsDetailPage = lazy(() => import('../pages/NewsDetailPage'));

// Auth pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(
  () => import('../pages/auth/ForgotPasswordPage')
);
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// User pages (protected)
const DashboardPage = lazy(() => import('../pages/user/DashboardPage'));
const ProfilePage = lazy(() => import('../pages/user/ProfilePage'));
const UserRewardsPage = lazy(() => import('../pages/user/UserRewardsPage'));

// Admin pages (admin-only)
const AdminDashboardPage = lazy(
  () => import('../pages/admin/AdminDashboardPage')
);
const ManageProjectsPage = lazy(
  () => import('../pages/admin/ManageProjectsPage')
);
const ManageUsersPage = lazy(() => import('../pages/admin/ManageUsersPage'));
const AuditLogPage = lazy(() => import('../pages/admin/AuditLogPage'));
const ManageNewsletterPage = lazy(
  () => import('../pages/admin/ManageNewsletterPage')
);
const ManageIdeasPage = lazy(() => import('../pages/admin/ManageIdeasPage'));
const ManageSubmissionsPage = lazy(
  () => import('../pages/admin/ManageSubmissionsPage')
);
const ManageRewardsPage = lazy(
  () => import('../pages/admin/ManageRewardsPage')
);
const MonitoringPage = lazy(() => import('../pages/admin/MonitoringPage'));
const ManageCommentsPage = lazy(
  () => import('../pages/admin/ManageCommentsPage')
);
const ManageLearnPage = lazy(() => import('../pages/admin/ManageLearnPage'));
const NewLearnPage = lazy(() => import('../pages/admin/NewLearnPage'));
const EditLearnPage = lazy(() => import('../pages/admin/EditLearnPage'));
const ManageFeedPage = lazy(() => import('../pages/admin/ManageFeedPage'));
const EditFeedPage = lazy(() => import('../pages/admin/EditFeedPage'));
const ManagePostsPage = lazy(() => import('../pages/admin/ManagePostsPage'));
const NewProjectPage = lazy(() => import('../pages/admin/NewProjectPage'));
const EditProjectPage = lazy(() => import('../pages/admin/EditProjectPage'));
const ManageEventsPage = lazy(() => import('../pages/admin/ManageEventsPage'));
const EventRegistrationsPage = lazy(
  () => import('../pages/admin/EventRegistrationsPage')
);
const NewEventPage = lazy(() => import('../pages/admin/NewEventPage'));
const ManageEventProposalsPage = lazy(
  () => import('../pages/admin/ManageEventProposalsPage')
);
const EditEventPage = lazy(() => import('../pages/admin/EditEventPage'));
const AccessibilityPage = lazy(() => import('../pages/AccessibilityPage'));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
const ImprintPage = lazy(() => import('../pages/ImprintPage'));

// Eager: shell + error/404 handling must not wait on a lazy chunk.
import NotFoundPage from '../pages/NotFoundPage';
import RouteErrorPage from '../pages/RouteErrorPage';
import ErrorBoundary from '../components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorPage />,
    children: [
      // Public
      { index: true, element: <LandingPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: 'sdg-dashboard', element: <SDGDashboardPage /> },
      { path: 'participate', element: <ParticipationPage /> },
      { path: 'get-involved', element: <GetInvolvedPage /> },
      { path: 'ideas', element: <IdeasPage /> },
      { path: 'ideas/:id', element: <IdeaDetailPage /> },
      { path: 'learn', element: <LearnPage /> },
      { path: 'learn/:id', element: <LearnDetailPage /> },
      { path: 'audiences', element: <AudiencesPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: 'transparency', element: <TransparencyPage /> },
      { path: 'rewards', element: <RewardsPage /> },
      { path: 'news', element: <NewsPage /> },
      { path: 'news/:source/:id', element: <NewsDetailPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'imprint', element: <ImprintPage /> },

      // Auth
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },

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
        path: 'admin/audit',
        element: (
          <AdminRoute>
            <AuditLogPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/newsletter',
        element: (
          <AdminRoute>
            <ManageNewsletterPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/ideas',
        element: (
          <AdminRoute>
            <ManageIdeasPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/submissions',
        element: (
          <AdminRoute>
            <ManageSubmissionsPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/event-proposals',
        element: (
          <AdminRoute>
            <ManageEventProposalsPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/rewards',
        element: (
          <AdminRoute>
            <ManageRewardsPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/monitoring',
        element: (
          <AdminRoute>
            <MonitoringPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/comments',
        element: (
          <AdminRoute>
            <ManageCommentsPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/learn',
        element: (
          <AdminRoute>
            <ManageLearnPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/learn/new',
        element: (
          <AdminRoute>
            <NewLearnPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/learn/:id/edit',
        element: (
          <AdminRoute>
            <EditLearnPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/feed',
        element: (
          <AdminRoute>
            <ManageFeedPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/feed/:id/edit',
        element: (
          <AdminRoute>
            <EditFeedPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/posts',
        element: (
          <AdminRoute>
            <ManagePostsPage />
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
      {
        path: 'admin/events',
        element: (
          <AdminRoute>
            <ManageEventsPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/events/new',
        element: (
          <AdminRoute>
            <NewEventPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/events/:id/edit',
        element: (
          <AdminRoute>
            <EditEventPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/events/:id/registrations',
        element: (
          <AdminRoute>
            <EventRegistrationsPage />
          </AdminRoute>
        ),
      },

      // Catch-all — any unknown URL renders the translated 404 page inside the
      // normal layout (header/footer preserved).
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  // Session bootstrap: restore auth from the httpOnly refresh cookie BEFORE any
  // route renders, so (a) a page reload never logs the user out and (b) every
  // initial data fetch already carries the access token (e.g. registeredByMe on
  // events). Guests resolve quickly with a 401 — the gate is barely visible.
  const [ready, setReady] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    let cancelled = false;
    initAuth()
      .then((session) => {
        if (session && !cancelled) setAuth(session.user, session.accessToken);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [setAuth]);

  if (!ready) {
    // Minimal splash — no text needed (sub-second); decorative spinner only.
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900"
        role="status"
        aria-live="polite"
      >
        <div
          className="h-8 w-8 rounded-full border-4 border-green-600 border-t-transparent motion-safe:animate-spin"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

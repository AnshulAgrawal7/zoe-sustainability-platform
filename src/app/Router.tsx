import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';
import { initAuth } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

// Public pages
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import SDGDashboardPage from '../pages/SDGDashboardPage';
import ParticipationPage from '../pages/ParticipationPage';
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';
import TransparencyPage from '../pages/TransparencyPage';
import AudiencesPage from '../pages/AudiencesPage';
import RewardsPage from '../pages/RewardsPage';
import GetInvolvedPage from '../pages/GetInvolvedPage';
import IdeasPage from '../pages/IdeasPage';
import IdeaDetailPage from '../pages/IdeaDetailPage';
import LearnPage from '../pages/LearnPage';
import LearnDetailPage from '../pages/LearnDetailPage';
import NewsPage from '../pages/NewsPage';
import NewsDetailPage from '../pages/NewsDetailPage';

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
import ManageIdeasPage from '../pages/admin/ManageIdeasPage';
import ManageSubmissionsPage from '../pages/admin/ManageSubmissionsPage';
import ManageRewardsPage from '../pages/admin/ManageRewardsPage';
import MonitoringPage from '../pages/admin/MonitoringPage';
import ManageCommentsPage from '../pages/admin/ManageCommentsPage';
import ManageLearnPage from '../pages/admin/ManageLearnPage';
import NewLearnPage from '../pages/admin/NewLearnPage';
import EditLearnPage from '../pages/admin/EditLearnPage';
import ManageFeedPage from '../pages/admin/ManageFeedPage';
import EditFeedPage from '../pages/admin/EditFeedPage';
import ManagePostsPage from '../pages/admin/ManagePostsPage';
import NewProjectPage from '../pages/admin/NewProjectPage';
import EditProjectPage from '../pages/admin/EditProjectPage';
import ManageEventsPage from '../pages/admin/ManageEventsPage';
import EventRegistrationsPage from '../pages/admin/EventRegistrationsPage';
import NewEventPage from '../pages/admin/NewEventPage';
import ManageEventProposalsPage from '../pages/admin/ManageEventProposalsPage';
import EditEventPage from '../pages/admin/EditEventPage';
import AccessibilityPage from '../pages/AccessibilityPage';
import PrivacyPage from '../pages/PrivacyPage';
import ImprintPage from '../pages/ImprintPage';

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

  return <RouterProvider router={router} />;
}

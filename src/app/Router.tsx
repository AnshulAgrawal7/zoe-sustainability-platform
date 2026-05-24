import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
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
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

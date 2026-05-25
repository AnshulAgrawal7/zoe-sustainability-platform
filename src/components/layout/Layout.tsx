import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PrototypeBanner from '../ui/PrototypeBanner';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <PrototypeBanner />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

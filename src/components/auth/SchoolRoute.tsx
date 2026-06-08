import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface SchoolRouteProps {
  children: React.ReactNode;
}

// Guards the school-coordinator dashboard. Only SCHOOL-role accounts may enter.
export default function SchoolRoute({ children }: SchoolRouteProps) {
  const { isAuthenticated, isSchool } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isSchool) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

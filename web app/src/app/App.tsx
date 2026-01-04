import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { MedicalRecordsPage } from './pages/patient/MedicalRecordsPage';
import { DoctorsPage } from './pages/patient/DoctorsPage';
import { ConnectionsPage } from './pages/patient/ConnectionsPage';
import { PatientMessagesPage } from './pages/patient/PatientMessagesPage';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientsPage } from './pages/doctor/PatientsPage';
import { ConnectionRequestsPage } from './pages/doctor/ConnectionRequestsPage';
import { DoctorMessagesPage } from './pages/doctor/DoctorMessagesPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DoctorVerificationPage } from './pages/admin/DoctorVerificationPage';
import { SystemStatsPage } from './pages/admin/SystemStatsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

// Public Pages
import { HomePage } from './pages/public/HomePage';

// Layouts
import { MainLayout } from './layouts/MainLayout';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to={`/${user?.role}`} replace /> : <RegisterPage />} />

      {/* Patient Routes */}
      <Route path="/patient" element={<PrivateRoute allowedRoles={['patient']}><MainLayout /></PrivateRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="records" element={<MedicalRecordsPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="messages" element={<PatientMessagesPage />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor" element={<PrivateRoute allowedRoles={['doctor']}><MainLayout /></PrivateRoute>}>
        <Route index element={<DoctorDashboard />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="connections" element={<ConnectionRequestsPage />} />
        <Route path="messages" element={<DoctorMessagesPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><MainLayout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="verifications" element={<DoctorVerificationPage />} />
        <Route path="stats" element={<SystemStatsPage />} />
        <Route path="audit" element={<AuditLogsPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

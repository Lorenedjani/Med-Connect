import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  MessageSquare, 
  UserCheck,
  Activity,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { useState } from 'react';

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case 'patient':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/patient' },
          { icon: FileText, label: 'Medical Records', path: '/patient/records' },
          { icon: Users, label: 'Find Doctors', path: '/patient/doctors' },
          { icon: UserCheck, label: 'Connections', path: '/patient/connections' },
          { icon: MessageSquare, label: 'Messages', path: '/patient/messages' },
        ];
      case 'doctor':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/doctor' },
          { icon: Users, label: 'My Patients', path: '/doctor/patients' },
          { icon: UserCheck, label: 'Connection Requests', path: '/doctor/connections' },
          { icon: MessageSquare, label: 'Messages', path: '/doctor/messages' },
        ];
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
          { icon: UserCheck, label: 'Doctor Verification', path: '/admin/verifications' },
          { icon: Activity, label: 'System Stats', path: '/admin/stats' },
          { icon: Shield, label: 'Audit Logs', path: '/admin/audit' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-2 p-2 rounded-md hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-xl font-semibold text-blue-600">Med-Connect</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {user?.fullName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}
        >
          <nav className="mt-16 lg:mt-0 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, UserCheck, MessageSquare, Activity } from 'lucide-react';
import { MOCK_CONNECTIONS, MOCK_PATIENTS, MOCK_ACCESS_LOGS } from '../../../lib/mockData';

export function DoctorDashboard() {
  const myConnections = MOCK_CONNECTIONS.filter(
    c => c.doctorId === 'doctor-1' && c.status === 'connected'
  );
  const pendingRequests = MOCK_CONNECTIONS.filter(
    c => c.doctorId === 'doctor-1' && c.status === 'pending'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-gray-600">Manage your patients and consultations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Patients</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myConnections.length}</div>
            <p className="text-xs text-gray-600">Active connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-gray-600">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-600">Unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Record Access</CardTitle>
            <Activity className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_ACCESS_LOGS.length}</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Welcome to your doctor dashboard. Here you can manage patient connections, view medical records, and communicate securely.</p>
        </CardContent>
      </Card>
    </div>
  );
}

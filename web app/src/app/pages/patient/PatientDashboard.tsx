import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Users, Shield, Activity, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_MEDICAL_RECORDS, MOCK_CONNECTIONS, MOCK_ACCESS_LOGS, MOCK_NOTIFICATIONS } from '../../../lib/mockData';

export function PatientDashboard() {
  const recentRecords = MOCK_MEDICAL_RECORDS.slice(0, 3);
  const recentActivity = MOCK_ACCESS_LOGS.slice(0, 3);
  const unreadNotifications = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your health overview.</p>
        </div>
        <Link to="/patient/records">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Record
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MOCK_MEDICAL_RECORDS.length}</div>
            <p className="text-xs text-gray-600">Total documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Doctors</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {MOCK_CONNECTIONS.filter(c => c.status === 'connected').length}
            </div>
            <p className="text-xs text-gray-600">Active connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Shield className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadNotifications}</div>
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
            <p className="text-xs text-gray-600">Total accesses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Records */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{record.title}</p>
                      <p className="text-sm text-gray-600">
                        {record.category.replace('_', ' ')} • {new Date(record.dateOfIssue).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
              <Link to="/patient/records">
                <Button variant="outline" className="w-full">View All Records</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Record Access Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Record accessed</p>
                      <p className="text-sm text-gray-600">
                        {new Date(log.accessedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {log.action}
                  </span>
                </div>
              ))}
              <Button variant="outline" className="w-full">View All Activity</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/patient/records">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <FileText className="h-6 w-6" />
                <span>Upload Records</span>
              </Button>
            </Link>
            <Link to="/patient/doctors">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Users className="h-6 w-6" />
                <span>Find Doctors</span>
              </Button>
            </Link>
            <Link to="/patient/connections">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Shield className="h-6 w-6" />
                <span>Manage Access</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { UserCheck, UserX, Shield, Clock } from 'lucide-react';
import { MOCK_CONNECTIONS, MOCK_DOCTORS } from '../../../lib/mockData';
import { toast } from 'sonner';

export function ConnectionsPage() {
  const connections = MOCK_CONNECTIONS.filter(c => c.patientId === 'patient-1');

  const getDoctorName = (doctorId: string) => {
    return MOCK_DOCTORS.find(d => d.id === doctorId)?.fullName || 'Unknown Doctor';
  };

  const handleRevoke = (doctorName: string) => {
    toast.success(`Access revoked for ${doctorName}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      connected: { className: 'bg-green-100 text-green-800', label: 'Connected' },
      pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      rejected: { className: 'bg-red-100 text-red-800', label: 'Rejected' },
    };
    return variants[status] || variants.pending;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Connections</h1>
        <p className="text-gray-600">Manage your doctor connections and access permissions</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {connections.map((connection) => {
          const doctorName = getDoctorName(connection.doctorId);
          const statusInfo = getStatusBadge(connection.status);

          return (
            <Card key={connection.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{doctorName}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Badge className={statusInfo.className}>
                            {statusInfo.label}
                          </Badge>
                          {connection.status === 'connected' && (
                            <Badge variant="outline" className="bg-blue-50">
                              <Shield className="h-3 w-3 mr-1" />
                              Access Granted
                            </Badge>
                          )}
                        </div>
                        <p className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Requested: {new Date(connection.requestedAt).toLocaleDateString()}
                        </p>
                        {connection.acceptedAt && (
                          <p>Connected: {new Date(connection.acceptedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {connection.status === 'connected' && (
                      <>
                        <Button variant="outline" size="sm">
                          Manage Access
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleRevoke(doctorName)}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {connection.status === 'pending' && (
                      <Badge variant="outline">Awaiting Response</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {connections.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
            <p className="text-gray-600">Start by finding and connecting with doctors</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

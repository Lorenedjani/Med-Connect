import { Card, CardContent } from '../../components/ui/card';
import { Users } from 'lucide-react';

export function PatientsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Patients</h1>
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">My Patients</h3>
          <p className="text-gray-600">View and manage your connected patients</p>
        </CardContent>
      </Card>
    </div>
  );
}

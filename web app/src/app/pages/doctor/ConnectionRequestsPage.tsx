import { Card, CardContent } from '../../components/ui/card';
import { UserCheck } from 'lucide-react';

export function ConnectionRequestsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Connection Requests</h1>
      <Card>
        <CardContent className="py-12 text-center">
          <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Connection Requests</h3>
          <p className="text-gray-600">Review and manage patient connection requests</p>
        </CardContent>
      </Card>
    </div>
  );
}

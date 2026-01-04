import { Card, CardContent } from '../../components/ui/card';
import { Shield } from 'lucide-react';

export function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Audit Logs</h1>
      <Card>
        <CardContent className="py-12 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Audit Logs</h3>
          <p className="text-gray-600">System activity and security audit trail</p>
        </CardContent>
      </Card>
    </div>
  );
}

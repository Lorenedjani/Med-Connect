import { Card, CardContent } from '../../components/ui/card';
import { Activity } from 'lucide-react';

export function SystemStatsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Statistics</h1>
      <Card>
        <CardContent className="py-12 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">System Statistics</h3>
          <p className="text-gray-600">Detailed platform analytics and metrics</p>
        </CardContent>
      </Card>
    </div>
  );
}

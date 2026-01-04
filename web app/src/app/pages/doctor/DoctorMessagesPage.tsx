import { Card, CardContent } from '../../components/ui/card';
import { MessageSquare } from 'lucide-react';

export function DoctorMessagesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      <Card>
        <CardContent className="py-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Messages</h3>
          <p className="text-gray-600">Secure messaging with your patients</p>
        </CardContent>
      </Card>
    </div>
  );
}

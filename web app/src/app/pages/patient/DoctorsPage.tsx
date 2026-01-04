import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { UserPlus, Search, MapPin, Briefcase } from 'lucide-react';
import { MOCK_DOCTORS } from '../../../lib/mockData';
import { toast } from 'sonner';

export function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredDoctors = MOCK_DOCTORS.filter(doctor =>
    doctor.verificationStatus === 'verified' && (
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleConnect = (doctorName: string) => {
    toast.success(`Connection request sent to ${doctorName}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Find Doctors</h1>
        <p className="text-gray-600">Connect with verified healthcare professionals</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or specialization..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {doctor.fullName.split(' ')[1]?.[0] || doctor.fullName[0]}
                  </span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Verified
                </Badge>
              </div>
              <CardTitle>{doctor.fullName}</CardTitle>
              <CardDescription className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{doctor.specialization}</span>
                </div>
                {doctor.experienceYears && (
                  <div className="text-sm">{doctor.experienceYears} years of experience</div>
                )}
                {doctor.affiliatedInstitutions && doctor.affiliatedInstitutions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{doctor.affiliatedInstitutions[0]}</span>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {doctor.bio && (
                <p className="text-sm text-gray-600 mb-4">{doctor.bio}</p>
              )}
              <Button 
                className="w-full" 
                onClick={() => handleConnect(doctor.fullName)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Send Connection Request
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

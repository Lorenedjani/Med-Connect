import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { FileText, Upload, Download, Eye, Trash2, Plus, Search } from 'lucide-react';
import { MOCK_MEDICAL_RECORDS } from '../../../lib/mockData';
import { RecordCategory } from '../../../types';
import { toast } from 'sonner';

export function MedicalRecordsPage() {
  const [records, setRecords] = useState(MOCK_MEDICAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'laboratory_results' as RecordCategory,
    dateOfIssue: '',
    issuingFacility: '',
    issuingDoctor: ''
  });

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.issuingFacility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || record.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    toast.success('Medical record uploaded successfully!');
    setIsUploadOpen(false);
    setUploadData({
      title: '',
      category: 'laboratory_results',
      dateOfIssue: '',
      issuingFacility: '',
      issuingDoctor: ''
    });
  };

  const getCategoryColor = (category: RecordCategory) => {
    const colors = {
      laboratory_results: 'bg-blue-100 text-blue-800',
      prescriptions: 'bg-green-100 text-green-800',
      medical_imaging: 'bg-purple-100 text-purple-800',
      doctors_notes: 'bg-yellow-100 text-yellow-800',
      vaccination_records: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-gray-600">Manage and organize your health documents</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Medical Record</DialogTitle>
              <DialogDescription>
                Add a new document to your medical records
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  placeholder="Blood Test Results"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={uploadData.category}
                  onValueChange={(value) => setUploadData({...uploadData, category: value as RecordCategory})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laboratory_results">Laboratory Results</SelectItem>
                    <SelectItem value="prescriptions">Prescriptions</SelectItem>
                    <SelectItem value="medical_imaging">Medical Imaging</SelectItem>
                    <SelectItem value="doctors_notes">Doctor's Notes</SelectItem>
                    <SelectItem value="vaccination_records">Vaccination Records</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfIssue">Date of Issue</Label>
                <Input
                  id="dateOfIssue"
                  type="date"
                  value={uploadData.dateOfIssue}
                  onChange={(e) => setUploadData({...uploadData, dateOfIssue: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facility">Issuing Facility</Label>
                <Input
                  id="facility"
                  placeholder="City General Hospital"
                  value={uploadData.issuingFacility}
                  onChange={(e) => setUploadData({...uploadData, issuingFacility: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Issuing Doctor (Optional)</Label>
                <Input
                  id="doctor"
                  placeholder="Dr. Smith"
                  value={uploadData.issuingDoctor}
                  onChange={(e) => setUploadData({...uploadData, issuingDoctor: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 10MB)</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="md:w-64">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="laboratory_results">Laboratory Results</SelectItem>
                <SelectItem value="prescriptions">Prescriptions</SelectItem>
                <SelectItem value="medical_imaging">Medical Imaging</SelectItem>
                <SelectItem value="doctors_notes">Doctor's Notes</SelectItem>
                <SelectItem value="vaccination_records">Vaccination Records</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">{record.title}</h3>
                      <Badge className={getCategoryColor(record.category)}>
                        {record.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Issuing Facility: {record.issuingFacility}</p>
                      {record.issuingDoctor && <p>Doctor: {record.issuingDoctor}</p>}
                      <p>Date: {new Date(record.dateOfIssue).toLocaleDateString()}</p>
                      <p>Size: {formatFileSize(record.fileSize)} • {record.fileType.toUpperCase()}</p>
                      <p className="flex items-center gap-1">
                        <span className="text-green-600">✓ Encrypted</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No records found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

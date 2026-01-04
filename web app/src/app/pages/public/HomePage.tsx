import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, Lock, Users, FileText, MessageSquare, Activity } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl">+</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Med-Connect</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Secure Medical Records Platform - Connect patients and doctors with end-to-end encrypted health records
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="text-lg">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>End-to-End Encryption</CardTitle>
              <CardDescription>
                All medical records are encrypted with AES-256 both in transit and at rest
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Granular Access Control</CardTitle>
              <CardDescription>
                Patients have complete control over who can access their medical records
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Doctor Verification</CardTitle>
              <CardDescription>
                All doctors undergo manual verification to ensure platform integrity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Digital Record Management</CardTitle>
              <CardDescription>
                Upload, categorize, and organize all your medical documents in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Secure Messaging</CardTitle>
              <CardDescription>
                Communicate with your healthcare providers through encrypted channels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Activity className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Audit Logging</CardTitle>
              <CardDescription>
                Complete transparency - see who accessed your records and when
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* User Types */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Who is Med-Connect for?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">Patients</CardTitle>
                <CardContent className="text-left">
                  <ul className="space-y-2 text-gray-600">
                    <li>• Store all medical records securely</li>
                    <li>• Control who accesses your data</li>
                    <li>• Find and connect with doctors</li>
                    <li>• Track record access history</li>
                  </ul>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">Doctors</CardTitle>
                <CardContent className="text-left">
                  <ul className="space-y-2 text-gray-600">
                    <li>• Access patient records with consent</li>
                    <li>• Review comprehensive medical history</li>
                    <li>• Communicate securely with patients</li>
                    <li>• Manage patient connections</li>
                  </ul>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">Administrators</CardTitle>
                <CardContent className="text-left">
                  <ul className="space-y-2 text-gray-600">
                    <li>• Verify doctor credentials</li>
                    <li>• Monitor system health</li>
                    <li>• Review audit logs</li>
                    <li>• Ensure compliance</li>
                  </ul>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-6">Join thousands of patients and doctors using Med-Connect</p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Med-Connect. This is a demonstration platform. Not for production use with real medical data.
          </p>
        </div>
      </footer>
    </div>
  );
}

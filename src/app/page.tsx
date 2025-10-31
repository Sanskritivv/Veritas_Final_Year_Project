import { Aperture, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-3">
          <Aperture className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Veritas
          </h1>
        </div>
        <p className="max-w-md text-muted-foreground">
          Secure, AI-powered credit risk scoring for financial institutions and
          applicants.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span>Admin Portal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Access risk analysis tools and manage applications.
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard">Admin Login</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                <span>Applicant Portal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Apply for loans and track your application status.
              </p>
              <Button asChild className="w-full">
                <Link href="/applicant/login">Applicant Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

import { Aperture, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4 text-center mb-8">
        <div className="flex items-center gap-3">
          <Aperture className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Veritas
          </h1>
        </div>
        <p className="max-w-xl text-muted-foreground">
          Secure, AI-powered credit risk scoring for financial institutions and
          loan applicants. Choose your portal to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="flex flex-col text-center">
          <CardHeader className="items-center">
            <Shield className="h-12 w-12 text-primary mb-2" />
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
            <CardDescription>
              Access risk analysis tools and manage applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center items-center">
            <p className="text-sm text-muted-foreground mb-4">
              For NBFC / Banking Admins.
            </p>
            <Button asChild className="w-full max-w-xs">
              <Link href="/dashboard">Admin Login</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col text-center">
          <CardHeader className="items-center">
            <User className="h-12 w-12 text-primary mb-2" />
            <CardTitle className="text-2xl">Applicant Portal</CardTitle>
            <CardDescription>
              Apply for loans and track your application status.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center items-center">
            <p className="text-sm text-muted-foreground mb-4">
              For Loan Applicants.
            </p>
            <Button asChild className="w-full max-w-xs">
              <Link href="/applicant/login">Applicant Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
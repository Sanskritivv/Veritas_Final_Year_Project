import { Aperture } from 'lucide-react';
import { IrisScanner } from '@/components/iris-scanner';

export default function ApplicantLoginPage() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center bg-card">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-3">
          <Aperture className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Veritas
          </h1>
        </div>
        <IrisScanner redirectTo="/applicant/dashboard" />
      </div>
    </main>
  );
}

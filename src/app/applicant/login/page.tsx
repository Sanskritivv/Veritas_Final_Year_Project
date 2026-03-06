"use client";

import { Aperture } from 'lucide-react';
import { IrisScanner } from '@/components/iris-scanner';

export default function ApplicantLoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-card px-4 py-8">
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-lg">
        <div className="flex items-center gap-3">
          <Aperture className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Veritas
          </h1>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          Secure biometric authentication powered by real-time iris detection
        </p>
        <IrisScanner redirectTo="/applicant/dashboard" />
      </div>
    </main>
  );
}

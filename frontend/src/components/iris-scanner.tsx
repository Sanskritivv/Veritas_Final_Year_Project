"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

type IrisScannerProps = {
  redirectTo?: string;
};

type IrisStatus = 'Initializing' | 'Authenticating...' | 'Authentication successful';

const IRIS_INIT_DELAY_MS = 1000;
const IRIS_AUTH_COMPLETE_MS = 2500;
const IRIS_REDIRECT_DELAY_MS = 2000;

export function IrisScanner({ redirectTo = '/dashboard' }: IrisScannerProps) {
  const [status, setStatus] = useState<IrisStatus>('Initializing');
  const [scanning, setScanning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus('Authenticating...');
      setScanning(true);
    }, IRIS_INIT_DELAY_MS);

    const timer2 = setTimeout(() => {
      setStatus('Authentication successful');
      setScanning(false);
      setCompleted(true);
    }, IRIS_AUTH_COMPLETE_MS);

    const timer3 = setTimeout(() => {
      router.push(redirectTo);
    }, IRIS_REDIRECT_DELAY_MS);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [router, redirectTo]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-64 w-64">
        <div
          className={cn(
            'absolute inset-0 rounded-full border-2 border-dashed border-primary transition-all duration-500',
            scanning ? 'animate-spin-slow' : '',
            completed ? 'border-green-500' : 'border-primary'
          )}
        />
        <div
          className={cn(
            'absolute inset-4 rounded-full border-2 border-primary/50 transition-all duration-500',
            completed ? 'border-green-500/50' : 'border-primary/50'
          )}
        />
        <div
          className={cn(
            'absolute inset-8 flex items-center justify-center rounded-full border-2 border-primary/20 transition-all duration-500',
            completed ? 'border-green-500/20' : 'border-primary/20'
          )}
        >
          <div className="relative h-40 w-40">
            <div
              className={cn(
                'absolute inset-0 rounded-full bg-primary/10 transition-all duration-500',
                scanning && 'animate-pulse',
                completed ? 'bg-green-500/10' : 'bg-primary/10'
              )}
            />
            <div className="absolute inset-8 rounded-full bg-primary/20" />
            <div className="absolute inset-12 rounded-full bg-primary/30" />
            <div className="absolute inset-16 rounded-full bg-primary" />
          </div>
        </div>
      </div>
      <p className="text-lg font-medium text-muted-foreground transition-colors duration-500 flex items-center gap-2">
        {completed ? (
          <span className="text-green-500">{status}</span>
        ) : (
          <>
            {scanning && <Loader className="animate-spin h-5 w-5" />}
            {status}
          </>
        )}
      </p>
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}

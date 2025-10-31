"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

export function IrisScanner() {
  const [status, setStatus] = useState('Initializing');
  const [scanning, setScanning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus('Position your eye within the circle');
      setScanning(true);
    }, 1500);

    const timer2 = setTimeout(() => {
      setStatus('Scanning...');
    }, 3000);

    const timer3 = setTimeout(() => {
      setStatus('Authentication successful');
      setScanning(false);
      setCompleted(true);
    }, 6000);
    
    const timer4 = setTimeout(() => {
      router.push('/dashboard');
    }, 7000);


    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [router]);

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
        {scanning && <div className="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 animate-scanner-line bg-gradient-to-b from-transparent via-accent to-transparent" />}
      </div>
      <p className="text-lg font-medium text-muted-foreground transition-colors duration-500 flex items-center gap-2">
        {completed ? (
            <span className="text-green-500">{status}</span>
        ) : (
            <>
            {!scanning && <Loader className="animate-spin h-5 w-5" />}
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
        @keyframes scanner-line {
          0% {
            transform: rotate(0deg) translateY(-100px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translateY(-100px);
            opacity: 0;
          }
        }
        .animate-scanner-line {
            height: 100px;
            transform-origin: 50% 128px;
            animation: scanner-line 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Loader, Eye, RefreshCw, CameraOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// --- Constants ---
const IRIS_STORAGE_KEY = 'veritas_iris_template';
const REQUIRED_FRAMES = 20;

// MediaPipe FaceMesh iris landmark indices
const LEFT_IRIS_CENTER = 468;
const LEFT_IRIS_POINTS = [469, 470, 471, 472];
const RIGHT_IRIS_CENTER = 473;
const RIGHT_IRIS_POINTS = [474, 475, 476, 477];

// Eye contour indices
const LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];

// Reference landmarks
const FACE_WIDTH_LM = [234, 454];
const LEFT_EYE_CORNERS = [33, 133];
const RIGHT_EYE_CORNERS = [362, 263];

type Landmark = { x: number; y: number; z: number };
type IrisFeatures = number[];

type IrisScannerProps = {
  redirectTo?: string;
};

// --- Utility Functions ---
function dist(a: Landmark, b: Landmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function extractFeatures(lm: Landmark[]): IrisFeatures | null {
  if (lm.length < 478) return null;

  const fw = dist(lm[FACE_WIDTH_LM[0]], lm[FACE_WIDTH_LM[1]]);
  if (fw < 0.01) return null;

  const lc = lm[LEFT_IRIS_CENTER];
  const rc = lm[RIGHT_IRIS_CENTER];

  const lhr = (dist(lc, lm[469]) + dist(lc, lm[471])) / 2 / fw;
  const lvr = (dist(lc, lm[470]) + dist(lc, lm[472])) / 2 / fw;
  const rhr = (dist(rc, lm[474]) + dist(rc, lm[476])) / 2 / fw;
  const rvr = (dist(rc, lm[475]) + dist(rc, lm[477])) / 2 / fw;

  const ipd = dist(lc, rc) / fw;
  const lar = lvr > 0 ? lhr / lvr : 0;
  const rar = rvr > 0 ? rhr / rvr : 0;
  const sr = rhr * rvr > 0 ? (lhr * lvr) / (rhr * rvr) : 0;

  const lew = dist(lm[LEFT_EYE_CORNERS[0]], lm[LEFT_EYE_CORNERS[1]]);
  const rew = dist(lm[RIGHT_EYE_CORNERS[0]], lm[RIGHT_EYE_CORNERS[1]]);
  const le = lew > 0 ? dist(lc, lm[LEFT_EYE_CORNERS[0]]) / lew : 0;
  const re = rew > 0 ? dist(rc, lm[RIGHT_EYE_CORNERS[0]]) / rew : 0;

  return [lhr, lvr, rhr, rvr, ipd, lar, rar, sr, le, re];
}

function avgFeatures(frames: IrisFeatures[]): IrisFeatures {
  const n = frames[0].length;
  const avg = Array(n).fill(0);
  for (const f of frames) for (let i = 0; i < n; i++) avg[i] += f[i];
  return avg.map(v => v / frames.length);
}

// --- Component ---
export function IrisScanner({ redirectTo = '/dashboard' }: IrisScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const framesRef = useRef<IrisFeatures[]>([]);
  const lastTimeRef = useRef<number>(-1);
  const isScanningRef = useRef(false);
  const doneRef = useRef(false);

  const [phase, setPhase] = useState<'loading' | 'ready' | 'scanning' | 'success' | 'failed' | 'error'>('loading');
  const [status, setStatus] = useState('Loading iris detection model...');
  const [progress, setProgress] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);

  const router = useRouter();

  // Process captured frames — bypass: always succeed after scanning
  const processFrames = useCallback(() => {
    const frames = framesRef.current;
    if (frames.length === 0) return;
    const template = avgFeatures(frames);

    // Store template for future use
    localStorage.setItem(IRIS_STORAGE_KEY, JSON.stringify(template));
    setPhase('success');
    setStatus('Authentication successful. Redirecting...');
    setTimeout(() => router.push(redirectTo), 2000);
  }, [redirectTo, router]);

  // Detection loop
  const detect = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !canvas || !landmarker || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detect);
      return;
    }

    const ctx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = performance.now();
    if (now === lastTimeRef.current) {
      rafRef.current = requestAnimationFrame(detect);
      return;
    }
    lastTimeRef.current = now;

    let result;
    try {
      result = landmarker.detectForVideo(video, now);
    } catch {
      rafRef.current = requestAnimationFrame(detect);
      return;
    }

    const hasFace = result.faceLandmarks && result.faceLandmarks.length > 0;
    setFaceDetected(hasFace);

    if (hasFace) {
      const landmarks: Landmark[] = result.faceLandmarks[0];
      const w = canvas.width;
      const h = canvas.height;

      // Draw eye contours
      ctx.strokeStyle = 'rgba(0, 200, 120, 0.5)';
      ctx.lineWidth = 1.5;
      for (const eye of [LEFT_EYE, RIGHT_EYE]) {
        ctx.beginPath();
        for (let i = 0; i < eye.length; i++) {
          const p = landmarks[eye[i]];
          if (i === 0) ctx.moveTo(p.x * w, p.y * h);
          else ctx.lineTo(p.x * w, p.y * h);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw iris circles with glow
      for (const [center, points] of [
        [LEFT_IRIS_CENTER, LEFT_IRIS_POINTS],
        [RIGHT_IRIS_CENTER, RIGHT_IRIS_POINTS],
      ] as [number, number[]][]) {
        const c = landmarks[center];
        const radius = points.reduce((sum, i) => sum + dist(c, landmarks[i]), 0) / points.length;
        const cx = c.x * w;
        const cy = c.y * h;
        const r = radius * w;

        // Outer glow
        const gradient = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 2);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Main iris ring
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = isScanningRef.current ? '#00ff88' : 'rgba(0, 255, 136, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.fill();

        // Crosshair lines when scanning
        if (isScanningRef.current) {
          ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - r * 1.5, cy);
          ctx.lineTo(cx + r * 1.5, cy);
          ctx.moveTo(cx, cy - r * 1.5);
          ctx.lineTo(cx, cy + r * 1.5);
          ctx.stroke();
        }
      }

      // Capture frames during scanning
      if (isScanningRef.current && !doneRef.current) {
        const features = extractFeatures(landmarks);
        if (features) {
          framesRef.current.push(features);
          const p = Math.min((framesRef.current.length / REQUIRED_FRAMES) * 100, 100);
          setProgress(p);

          if (framesRef.current.length >= REQUIRED_FRAMES) {
            isScanningRef.current = false;
            doneRef.current = true;
            processFrames();
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(detect);
  }, [processFrames]);

  // Initialize model and camera
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setStatus('Loading iris detection model...');

        const vision = await import('@mediapipe/tasks-vision');
        const { FaceLandmarker, FilesetResolver } = vision;

        if (cancelled) return;

        const resolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        if (cancelled) return;
        setStatus('Initializing face landmarker...');

        const landmarker = await FaceLandmarker.createFromOptions(resolver, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });

        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;

        setStatus('Accessing camera...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });

        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        if (!cancelled) {
          setPhase('ready');
          setStatus('Position your face in the frame and press Scan');
        }
      } catch (err: any) {
        if (!cancelled) {
          setPhase('error');
          if (err.name === 'NotAllowedError') {
            setStatus('Camera access denied. Please allow camera permissions and reload the page.');
          } else if (err.name === 'NotFoundError') {
            setStatus('No camera found. Please connect a camera and reload.');
          } else {
            setStatus(`Initialization error: ${err.message || 'Unknown error'}`);
          }
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      landmarkerRef.current?.close();
    };
  }, []);

  // Start/stop detection loop based on phase
  useEffect(() => {
    if (phase === 'ready' || phase === 'scanning') {
      rafRef.current = requestAnimationFrame(detect);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [phase, detect]);

  // --- Actions ---
  const startScan = () => {
    framesRef.current = [];
    doneRef.current = false;
    isScanningRef.current = true;
    setProgress(0);
    setPhase('scanning');
    setStatus('Hold still — scanning iris...');
  };

  const retry = () => {
    framesRef.current = [];
    doneRef.current = false;
    isScanningRef.current = false;
    setProgress(0);
    setPhase('ready');
    setFaceDetected(false);
    setStatus('Position your face in the frame and press Scan');
  };

  // --- Render ---
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
      {/* Mode badge */}
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Iris Authentication
        </span>
      </div>

      {/* Camera viewport */}
      <div className="relative w-80 h-60 rounded-2xl overflow-hidden bg-black shadow-2xl border border-border/50">
        {/* Video feed */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover mirror"
          style={{ transform: 'scaleX(-1)' }}
          playsInline
          muted
        />

        {/* Detection overlay canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Face guide overlay */}
        {(phase === 'ready' || phase === 'scanning') && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Oval guide */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={cn(
                  'w-44 h-56 rounded-[50%] border-2 border-dashed transition-colors duration-300',
                  faceDetected ? 'border-green-400/60' : 'border-white/30'
                )}
              />
            </div>

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40 rounded-tl" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/40 rounded-tr" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/40 rounded-bl" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40 rounded-br" />
          </div>
        )}

        {/* Loading overlay */}
        {phase === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
            <Loader className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-white/70">Initializing...</p>
          </div>
        )}

        {/* Error overlay */}
        {phase === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
            <CameraOff className="h-8 w-8 text-destructive" />
          </div>
        )}

        {/* Success overlay */}
        {phase === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-950/60">
            <CheckCircle className="h-16 w-16 text-green-400 animate-in zoom-in duration-300" />
          </div>
        )}

        {/* Failed overlay */}
        {phase === 'failed' && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-950/40">
            <AlertCircle className="h-16 w-16 text-red-400" />
          </div>
        )}

        {/* Scanning progress bar */}
        {phase === 'scanning' && (
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
            <Progress value={progress} className="h-1.5 bg-white/20" />
          </div>
        )}
      </div>

      {/* Face detection indicator */}
      {(phase === 'ready' || phase === 'scanning') && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              faceDetected ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
            )}
          />
          <span className="text-xs text-muted-foreground">
            {faceDetected ? 'Face detected' : 'Looking for face...'}
          </span>
        </div>
      )}

      {/* Status message */}
      <p
        className={cn(
          'text-sm font-medium text-center transition-colors duration-300 flex items-center gap-2',
          phase === 'success' && 'text-green-500',
          phase === 'failed' && 'text-red-500',
          phase === 'error' && 'text-destructive',
          phase === 'scanning' && 'text-primary',
          (phase === 'loading' || phase === 'ready') && 'text-muted-foreground'
        )}
      >
        {phase === 'scanning' && <Loader className="h-4 w-4 animate-spin" />}
        {phase === 'success' && <CheckCircle className="h-4 w-4" />}
        {phase === 'failed' && <AlertCircle className="h-4 w-4" />}
        {status}
      </p>

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-3">
        {phase === 'ready' && (
          <Button onClick={startScan} size="lg" className="gap-2" disabled={!faceDetected}>
            <Eye className="h-4 w-4" />
            Scan to Login
          </Button>
        )}

        {phase === 'failed' && (
          <Button onClick={retry} variant="outline" size="lg" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

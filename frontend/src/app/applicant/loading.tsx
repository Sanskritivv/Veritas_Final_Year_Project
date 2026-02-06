export default function ApplicantLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-4">
        <div className="h-10 w-1/2 rounded bg-muted animate-pulse" />
        <div className="h-6 w-1/3 rounded bg-muted animate-pulse" />
        <div className="h-40 rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  );
}



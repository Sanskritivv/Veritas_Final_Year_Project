export default function ApplicantDashboardLoading() {
  return (
    <div className="grid gap-6 p-6">
      <div className="h-32 rounded-lg bg-muted animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}



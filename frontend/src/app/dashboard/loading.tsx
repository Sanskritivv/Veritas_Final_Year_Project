export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
      <div className="h-80 rounded-lg bg-muted animate-pulse" />
    </div>
  );
}



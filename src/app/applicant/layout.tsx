import { AppShell } from '@/components/applicant-app-shell';

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}

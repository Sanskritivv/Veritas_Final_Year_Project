'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const applications = [
  {
    id: 'APP-001',
    name: 'John Smith',
    amount: 5000,
    status: 'Pending',
    date: '2023-10-01',
  },
  {
    id: 'APP-002',
    name: 'Emily Johnson',
    amount: 15000,
    status: 'Approved',
    date: '2023-09-28',
  },
  {
    id: 'APP-003',
    name: 'Michael Williams',
    amount: 2500,
    status: 'Rejected',
    date: '2023-09-25',
  },
  {
    id: 'APP-004',
    name: 'Jessica Brown',
    amount: 30000,
    status: 'Approved',
    date: '2023-09-22',
  },
  {
    id: 'APP-005',
    name: 'David Jones',
    amount: 8000,
    status: 'Pending',
    date: '2023-10-02',
  },
  {
    id: 'APP-006',
    name: 'Sarah Miller',
    amount: 120000,
    status: 'Approved',
    date: '2023-09-20',
  },
];

const statusVariantMap: {
  [key: string]: 'default' | 'secondary' | 'destructive';
} = {
  Approved: 'default',
  Pending: 'secondary',
  Rejected: 'destructive',
};

export default function DashboardPage() {
  const [selectedApp, setSelectedApp] = useState<typeof applications[0] | null>(null);
  const { toast } = useToast();

  const handleRowClick = (app: typeof applications[0]) => {
    setSelectedApp(app);
    toast({
      title: 'Application details',
      description: `Viewing details for ${app.name}'s application.`,
    });
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="sm:col-span-1 xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Loan Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$177,500</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1 xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Applicants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1 xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50%</div>
            <p className="text-xs text-muted-foreground">
              -5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1 xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Auto-Approved
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+16</div>
            <p className="text-xs text-muted-foreground">
              2 auto-approved this week
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1 xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manual Review</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground">
              1 requires final sign-off
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1 xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending KYC
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +2 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Application ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow
                  key={app.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(app)}
                >
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {app.id}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[app.status] || 'default'}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {`$${app.amount.toLocaleString()}`}
                  </TableCell>
                  <TableCell>{app.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              View details for {selectedApp?.name}'s loan application.
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Application ID</p>
                <p className="text-sm text-muted-foreground">{selectedApp.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant={statusVariantMap[selectedApp.status] || 'default'}>
                  {selectedApp.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Loan Amount</p>
                <p className="text-sm text-muted-foreground">
                  ${selectedApp.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Application Date</p>
                <p className="text-sm text-muted-foreground">{selectedApp.date}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

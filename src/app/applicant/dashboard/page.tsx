'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileUp, FileCheck2 } from 'lucide-react';

const application = {
  id: 'APP-2024-07X',
  status: 'Pending KYC',
  progress: 25,
  documents: [
    { name: 'Identity Proof', uploaded: true },
    { name: 'Address Proof', uploaded: true },
    { name: 'Income Statement', uploaded: false },
    { name: 'Bank Statements', uploaded: false },
  ],
};

const statusConfig = {
    'Pending KYC': {
        color: 'secondary',
        description: 'Please upload the required documents to proceed.'
    },
    'In Review': {
        color: 'secondary',
        description: 'Your application is being reviewed by our team.'
    },
    'Approved': {
        color: 'default',
        description: 'Congratulations! Your loan has been approved.'
    },
    'Rejected': {
        color: 'destructive',
        description: 'We regret to inform you that your application has been rejected.'
    }
} as const;


type ApplicationStatus = keyof typeof statusConfig;

export default function ApplicantDashboardPage() {
    const currentStatus = application.status as ApplicationStatus;
    const {color: badgeVariant, description} = statusConfig[currentStatus];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Loan Application</CardTitle>
          <CardDescription>
            Application ID: {application.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="font-medium">Status:</span>
            <Badge variant={badgeVariant}>{application.status}</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{description}</p>
            <Progress value={application.progress} className="w-full" />
            <p className="text-sm font-medium text-right">{application.progress}% complete</p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.documents.map((doc) => (
                <Card key={doc.name} className="flex flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        {doc.uploaded ? <FileCheck2 className="h-6 w-6 text-green-500" /> : <FileUp className="h-6 w-6 text-muted-foreground" />}
                         <span className="font-medium text-sm">{doc.name}</span>
                    </div>
                  {!doc.uploaded && (
                    <Button size="sm" variant="outline">
                      <FileUp className="h-4 w-4 mr-2" /> Upload
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Withdraw Application</Button>
            <Button>Contact Support</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

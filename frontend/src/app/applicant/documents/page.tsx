'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, FileUp, FileCheck2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type DocumentStatus = 'missing' | 'uploaded' | 'pending-review';

type ApplicantDocument = {
  id: string;
  name: string;
  status: DocumentStatus;
};

const initialDocuments: ApplicantDocument[] = [
  { id: 'id-proof', name: 'Identity Proof', status: 'uploaded' },
  { id: 'address-proof', name: 'Address Proof', status: 'uploaded' },
  { id: 'income-statement', name: 'Income Statement', status: 'missing' },
  { id: 'bank-statements', name: 'Bank Statements (last 6 months)', status: 'missing' },
];

const statusLabel: Record<DocumentStatus, string> = {
  missing: 'Missing',
  uploaded: 'Uploaded',
  'pending-review': 'Pending Review',
};

const statusVariant: Record<DocumentStatus, 'secondary' | 'default' | 'outline'> = {
  missing: 'secondary',
  uploaded: 'default',
  'pending-review': 'outline',
};

export default function ApplicantDocumentsPage() {
  const [documents, setDocuments] = useState<ApplicantDocument[]>(initialDocuments);
  const { toast } = useToast();

  const uploadedCount = documents.filter((d) => d.status !== 'missing').length;
  const completion = Math.round((uploadedCount / documents.length) * 100);

  const handleMockUpload = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    // Simulate upload delay
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, status: 'pending-review' }
            : d,
        ),
      );
      toast({
        title: 'Document uploaded',
        description: `${doc.name} has been uploaded and is pending review.`,
      });
    }, 500);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Required Documents
          </CardTitle>
          <CardDescription>
            Upload and track the status of documents required to process your loan application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {uploadedCount} of {documents.length} documents submitted
              </span>
              <span className="font-medium">{completion}% complete</span>
            </div>
            <Progress value={completion} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const isMissing = doc.status === 'missing';
              const isUploaded = doc.status === 'uploaded';

              return (
                <Card key={doc.id} className="flex flex-col justify-between">
                  <CardHeader className="space-y-1 pb-2">
                    <div className="flex items-center gap-2">
                      {isUploaded ? (
                        <FileCheck2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <FileUp className="h-5 w-5 text-muted-foreground" />
                      )}
                      <CardTitle className="text-base">{doc.name}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant={statusVariant[doc.status]}>
                        {statusLabel[doc.status]}
                      </Badge>
                      {!isMissing && !isUploaded && (
                        <span className="text-xs text-muted-foreground">
                          Our team will review this shortly.
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button
                      size="sm"
                      variant={isMissing ? 'outline' : 'ghost'}
                      className="w-full"
                      disabled={!isMissing}
                      onClick={() => handleMockUpload(doc.id)}
                    >
                      <FileUp className="h-4 w-4 mr-2" />
                      {isMissing ? 'Upload (demo)' : 'Already submitted'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



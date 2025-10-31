'use client';
import { useState } from 'react';
import RiskAnalysisForm from './risk-analysis-form';
import RiskScoreDisplay from './risk-score-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AnalysisResult = {
  creditRiskScore: number;
  riskAssessment: string;
  recommendedAction: string;
};

type FormInputData = {
    creditScore: number;
    income: number;
    debt: number;
    loanAmount: number;
    loanDuration: number;
}

export default function RiskScoringPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [formInputData, setFormInputData] = useState<FormInputData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult, input: FormInputData) => {
    setAnalysisResult(result);
    setFormInputData(input);
    setError(null);
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    setAnalysisResult(null);
    setFormInputData(null);
  }

  const handleReset = () => {
    setAnalysisResult(null);
    setFormInputData(null);
    setError(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2">
        <RiskAnalysisForm
          onAnalysisComplete={handleAnalysisComplete}
          onAnalysisError={handleAnalysisError}
          setLoading={setIsLoading}
          onReset={handleReset}
          isAnalysisDone={!!analysisResult}
        />
      </div>
      <div className="lg:col-span-3">
        <Card className="min-h-[600px]">
          <CardHeader>
            <CardTitle>Risk Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">
                  Performing complex risk analysis...
                </p>
              </div>
            ) : error ? (
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : analysisResult && formInputData ? (
              <RiskScoreDisplay result={analysisResult} inputData={formInputData} />
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-lg">Results will be displayed here.</p>
                <p className="text-sm">
                  Please fill out the form to start the analysis.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

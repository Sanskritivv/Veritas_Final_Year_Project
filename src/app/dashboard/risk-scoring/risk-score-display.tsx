'use client';

import { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { provideRiskFactorExplanationsAction } from '@/app/actions';
import { Loader2, Lightbulb } from 'lucide-react';

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

type RiskScoreDisplayProps = {
  result: AnalysisResult;
  inputData: FormInputData;
};

export default function RiskScoreDisplay({ result, inputData }: RiskScoreDisplayProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scoreColor =
    result.creditRiskScore > 75
      ? 'hsl(var(--primary))'
      : result.creditRiskScore > 50
      ? 'hsl(43 74% 66%)'
      : 'hsl(var(--destructive))';

  const chartData = [
    { name: 'score', value: result.creditRiskScore, fill: scoreColor },
  ];

  const handleGetExplanation = async () => {
    setIsLoadingExplanation(true);
    setError(null);
    const response = await provideRiskFactorExplanationsAction(inputData);
    if(response.success && response.explanation) {
        setExplanation(response.explanation);
    } else {
        setError(response.error || "Failed to load explanation.");
    }
    setIsLoadingExplanation(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1 flex flex-col items-center justify-center">
            <CardHeader className="items-center pb-0">
                <CardTitle>Credit Risk Score</CardTitle>
            </CardHeader>
          <CardContent className="flex-1 w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="80%"
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  angleAxisId={0}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-4xl font-bold"
                  style={{ fill: scoreColor }}
                >
                  {result.creditRiskScore}
                </text>
                 <text
                  x="50%"
                  y="65%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm fill-muted-foreground"
                >
                  out of 100
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recommendation</CardTitle>
            <CardDescription>{result.recommendedAction}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{result.riskAssessment}</p>
          </CardContent>
        </Card>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className='flex items-center gap-2'>
              <Lightbulb className="h-4 w-4 text-primary"/>
              AI-Powered Explanation
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {explanation ? (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                {explanation}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                {isLoadingExplanation ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Generating detailed explanation...</p>
                  </>
                ) : error ? (
                    <p className="text-destructive">{error}</p>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      Click the button to get a detailed, AI-powered explanation of the factors contributing to this risk score.
                    </p>
                    <Button onClick={handleGetExplanation}>
                      Explain Risk Factors
                    </Button>
                  </>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

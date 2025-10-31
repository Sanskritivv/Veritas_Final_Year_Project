'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateCreditRiskScoreAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

const formSchema = z.object({
  income: z.string().min(1, 'Income is required.'),
  debt: z.string().min(1, 'Debt is required.'),
  creditScore: z.string().min(1, 'Credit score is required.'),
  loanAmount: z.string().min(1, 'Loan amount is required.'),
  loanDuration: z.string().min(1, 'Loan duration is required.'),
  financialData: z.string().min(50, 'Financial summary must be at least 50 characters.'),
});

type RiskAnalysisFormProps = {
  onAnalysisComplete: (result: any, input: any) => void;
  onAnalysisError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  onReset: () => void;
  isAnalysisDone: boolean;
};

function SubmitButton({ isAnalysisDone }: { isAnalysisDone: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || isAnalysisDone} className="w-full">
      {pending ? 'Analyzing...' : 'Analyze Risk'}
    </Button>
  );
}

export default function RiskAnalysisForm({ onAnalysisComplete, onAnalysisError, setLoading, onReset, isAnalysisDone }: RiskAnalysisFormProps) {
  const [state, formAction] = useFormState(generateCreditRiskScoreAction, {
    success: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: '60000',
      debt: '15000',
      creditScore: '720',
      loanAmount: '10000',
      loanDuration: '36',
      financialData: 'The applicant has a stable job as a software engineer with a consistent income. They have a mortgage and a car loan, with a good payment history. No defaults or bankruptcies. They also have a small investment portfolio and a healthy savings account.',
    },
  });

  const { formState, reset } = form;

  useEffect(() => {
    setLoading(formState.isSubmitting);
  }, [formState.isSubmitting, setLoading]);

  useEffect(() => {
    if (state.success && state.data) {
        const inputData = form.getValues();
        const numericInputData = {
            creditScore: Number(inputData.creditScore),
            income: Number(inputData.income),
            debt: Number(inputData.debt),
            loanAmount: Number(inputData.loanAmount),
            loanDuration: Number(inputData.loanDuration),
        };
      onAnalysisComplete(state.data, numericInputData);
    } else if (!state.success && (state.error || state.fieldErrors)) {
        let errorMessage = state.error || "An unknown error occurred.";
        if (state.fieldErrors) {
            const fieldErrorMessages = Object.values(state.fieldErrors).flat().join(' ');
            errorMessage = `${state.error} ${fieldErrorMessages}`;
        }
        onAnalysisError(errorMessage);
    }
  }, [state, onAnalysisComplete, onAnalysisError, form]);

  const handleReset = () => {
    reset();
    onReset();
  }

  return (
    <Card>
      <Form {...form}>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Credit Risk Analysis</CardTitle>
            <CardDescription>
              Enter applicant financial data to generate a risk score.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="60000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="debt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Debt ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="creditScore"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Credit Score</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="300-850" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="loanAmount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Loan Amount ($)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="10000" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="loanDuration"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Duration (m)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="36" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="financialData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed summary of the applicant's financial situation..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    Include income sources, debt types, credit history, assets, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex gap-2">
            <SubmitButton isAnalysisDone={isAnalysisDone} />
            <Button type="button" variant="outline" onClick={handleReset} className="w-full">Reset</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

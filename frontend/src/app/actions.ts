'use server';

import { generateCreditRiskScore } from '@/ai/flows/generate-credit-risk-score';
import { provideRiskFactorExplanations } from '@/ai/flows/provide-risk-factor-explanations';
import { z } from 'zod';

const RiskAnalysisSchema = z.object({
  income: z.coerce.number().min(0, 'Income must be a positive number.'),
  debt: z.coerce.number().min(0, 'Debt must be a positive number.'),
  creditScore: z.coerce.number().min(300, 'Credit score must be at least 300.').max(850, 'Credit score must be at most 850.'),
  loanAmount: z.coerce.number().min(1, 'Loan amount must be greater than 0.'),
  loanDuration: z.coerce.number().min(1, 'Loan duration must be at least 1 month.'),
  financialData: z.string().min(50, 'Financial summary must be at least 50 characters.'),
});

type AnalysisResult = {
  creditRiskScore: number;
  riskAssessment: string;
  recommendedAction: string;
};

type ActionState = {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function generateCreditRiskScoreAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  const parseResult = RiskAnalysisSchema.safeParse(rawData);

  if (!parseResult.success) {
    return { 
      success: false,
      error: 'Invalid form data.',
      fieldErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  const { financialData } = parseResult.data;

  try {
    const result = await generateCreditRiskScore({ financialData });
    return { success: true, data: result };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to generate credit risk score. Please try again.' };
  }
}

const ExplanationSchema = z.object({
    creditScore: z.coerce.number(),
    income: z.coerce.number(),
    debt: z.coerce.number(),
    loanAmount: z.coerce.number(),
    loanDuration: z.coerce.number(),
});

export async function provideRiskFactorExplanationsAction(data: unknown): Promise<{ success: boolean; explanation?: string; error?: string }> {
    const parseResult = ExplanationSchema.safeParse(data);

    if (!parseResult.success) {
        return { success: false, error: 'Invalid data for explanation.' };
    }

    try {
        const { explanations } = await provideRiskFactorExplanations(parseResult.data);
        return { success: true, explanation: explanations };
    } catch(e) {
        console.error(e);
        return { success: false, error: 'Failed to get risk factor explanations.' };
    }
}

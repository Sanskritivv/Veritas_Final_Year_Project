'use server';

/**
 * @fileOverview Generates a credit risk score for loan applicants based on their financial data.
 *
 * - generateCreditRiskScore - A function that generates the credit risk score.
 * - CreditRiskScoreInput - The input type for the generateCreditRiskScore function.
 * - CreditRiskScoreOutput - The return type for the generateCreditRiskScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreditRiskScoreInputSchema = z.object({
  financialData: z
    .string()
    .describe(
      'The financial data of the loan applicant, including income, debt, credit history, and assets.'
    ),
});
export type CreditRiskScoreInput = z.infer<typeof CreditRiskScoreInputSchema>;

const CreditRiskScoreOutputSchema = z.object({
  creditRiskScore: z
    .number()
    .describe('The credit risk score, ranging from 0 to 100, with higher scores indicating lower risk.'),
  riskAssessment: z
    .string()
    .describe('A detailed assessment of the applicant’s credit risk based on their financial data.'),
  recommendedAction: z
    .string()
    .describe('Recommended action based on the risk assessment, such as approve, deny, or request additional information.'),
});
export type CreditRiskScoreOutput = z.infer<typeof CreditRiskScoreOutputSchema>;

export async function generateCreditRiskScore(
  input: CreditRiskScoreInput
): Promise<CreditRiskScoreOutput> {
  return generateCreditRiskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'creditRiskScorePrompt',
  input: {schema: CreditRiskScoreInputSchema},
  output: {schema: CreditRiskScoreOutputSchema},
  prompt: `You are an expert credit risk analyst. Your task is to assess the creditworthiness of loan applicants based on their financial data.

  Analyze the following financial data and generate a credit risk score, provide a detailed risk assessment, and recommend an action.

  Financial Data: {{{financialData}}}

  Credit Risk Score (0-100): Provide a score between 0 and 100, where higher scores indicate lower risk.
  Risk Assessment: Provide a detailed assessment of the applicant’s credit risk based on their financial data.
  Recommended Action: Provide a recommended action based on the risk assessment (e.g., approve, deny, or request additional information).`,
});

const generateCreditRiskScoreFlow = ai.defineFlow(
  {
    name: 'generateCreditRiskScoreFlow',
    inputSchema: CreditRiskScoreInputSchema,
    outputSchema: CreditRiskScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

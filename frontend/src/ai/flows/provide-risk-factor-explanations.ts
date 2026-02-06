'use server';
/**
 * @fileOverview Explains the factors contributing to the credit risk score.
 *
 * - provideRiskFactorExplanations - A function that provides explanations for credit risk factors.
 * - RiskFactorExplanationsInput - The input type for the provideRiskFactorExplanations function.
 * - RiskFactorExplanationsOutput - The return type for the provideRiskFactorExplanations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskFactorExplanationsInputSchema = z.object({
  creditScore: z.number().describe('The credit score of the applicant.'),
  income: z.number().describe('The income of the applicant.'),
  debt: z.number().describe('The total debt of the applicant.'),
  loanAmount: z.number().describe('The requested loan amount.'),
  loanDuration: z.number().describe('The duration of the loan in months.'),
});
export type RiskFactorExplanationsInput = z.infer<typeof RiskFactorExplanationsInputSchema>;

const RiskFactorExplanationsOutputSchema = z.object({
  explanations: z.string().describe('Explanations for the factors contributing to the credit risk score.'),
});
export type RiskFactorExplanationsOutput = z.infer<typeof RiskFactorExplanationsOutputSchema>;

export async function provideRiskFactorExplanations(input: RiskFactorExplanationsInput): Promise<RiskFactorExplanationsOutput> {
  return provideRiskFactorExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskFactorExplanationsPrompt',
  input: {schema: RiskFactorExplanationsInputSchema},
  output: {schema: RiskFactorExplanationsOutputSchema},
  prompt: `You are a credit risk analysis expert. Explain the impact of the following factors on the credit risk score.

Credit Score: {{{creditScore}}}
Income: {{{income}}}
Debt: {{{debt}}}
Loan Amount: {{{loanAmount}}}
Loan Duration: {{{loanDuration}}}

Provide a detailed explanation of how each factor influences the credit risk, highlighting potential areas of concern and their overall impact.`,
});

const provideRiskFactorExplanationsFlow = ai.defineFlow(
  {
    name: 'provideRiskFactorExplanationsFlow',
    inputSchema: RiskFactorExplanationsInputSchema,
    outputSchema: RiskFactorExplanationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// src/ai/flows/follow-up-question-understanding.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for understanding and answering follow-up questions in the context of a document.
 *
 * - followUpQuestionUnderstanding - A function that takes the document, previous question, previous answer, and the follow-up question and returns an intelligent answer.
 * - FollowUpQuestionUnderstandingInput - The input type for the followUpQuestionUnderstanding function.
 * - FollowUpQuestionUnderstandingOutput - The return type for the followUpQuestionUnderstanding function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FollowUpQuestionUnderstandingInputSchema = z.object({
  document: z.string().describe('The document content to extract information from.'),
  previousQuestion: z.string().describe('The previous question asked by the user.'),
  previousAnswer: z.string().describe('The previous answer given to the user.'),
  followUpQuestion: z.string().describe('The follow-up question asked by the user.'),
});

export type FollowUpQuestionUnderstandingInput = z.infer<
  typeof FollowUpQuestionUnderstandingInputSchema
>;

const FollowUpQuestionUnderstandingOutputSchema = z.object({
  answer: z.string().describe('The intelligent answer to the follow-up question.'),
});

export type FollowUpQuestionUnderstandingOutput = z.infer<
  typeof FollowUpQuestionUnderstandingOutputSchema
>;

export async function followUpQuestionUnderstanding(
  input: FollowUpQuestionUnderstandingInput
): Promise<FollowUpQuestionUnderstandingOutput> {
  return followUpQuestionUnderstandingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'followUpQuestionUnderstandingPrompt',
  input: {schema: FollowUpQuestionUnderstandingInputSchema},
  output: {schema: FollowUpQuestionUnderstandingOutputSchema},
  prompt: `You are an expert AI assistant that answers question based on the context of a document.

  Document: {{{document}}}

  Previous Question: {{{previousQuestion}}}
  Previous Answer: {{{previousAnswer}}}

  Follow-up Question: {{{followUpQuestion}}}

  Answer:`, // Provide a clear answer to the follow-up question, referencing the document when possible.
});

const followUpQuestionUnderstandingFlow = ai.defineFlow(
  {
    name: 'followUpQuestionUnderstandingFlow',
    inputSchema: FollowUpQuestionUnderstandingInputSchema,
    outputSchema: FollowUpQuestionUnderstandingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

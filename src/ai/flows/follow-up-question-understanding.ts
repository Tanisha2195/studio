// src/ai/flows/follow-up-question-understanding.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for understanding and answering follow-up questions in the context of a document.
 *
 * - followUpQuestionUnderstanding - A function that takes the document (text or URI), previous question, previous answer, and the follow-up question and returns an intelligent answer.
 * - FollowUpQuestionUnderstandingInput - The input type for the followUpQuestionUnderstanding function.
 * - FollowUpQuestionUnderstandingOutput - The return type for the followUpQuestionUnderstanding function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FollowUpQuestionUnderstandingInputSchema = z.object({
  documentText: z
    .string()
    .optional()
    .describe('The text content of the document (primarily for .txt or extracted from .docx).'),
  documentDataUri: z
    .string()
    .optional()
    .describe(
      "A document (e.g., PDF), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Used if documentText is not provided."
    ),
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
  prompt: `You are an expert AI assistant that answers questions based on the context of a document.

  {{#if documentText}}
  Document Text:
  {{{documentText}}}
  {{else if documentDataUri}}
  Document (analyze content from media URI):
  {{media url=documentDataUri}}
  {{/if}}

  Previous Question: {{{previousQuestion}}}
  Previous Answer: {{{previousAnswer}}}

  Follow-up Question: {{{followUpQuestion}}}

  Answer:`,
});

const followUpQuestionUnderstandingFlow = ai.defineFlow(
  {
    name: 'followUpQuestionUnderstandingFlow',
    inputSchema: FollowUpQuestionUnderstandingInputSchema,
    outputSchema: FollowUpQuestionUnderstandingOutputSchema,
  },
  async input => {
    if (!input.documentText && !input.documentDataUri) {
      throw new Error('Either documentText or documentDataUri must be provided for follow-up questions.');
    }
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering questions based on the content of an uploaded document.
 *
 * - answerQuestionsFromDocument - A function that takes a document and a question as input, and returns an answer extracted from the document.
 * - AnswerQuestionsFromDocumentInput - The input type for the answerQuestionsFromDocument function.
 * - AnswerQuestionsFromDocumentOutput - The return type for the answerQuestionsFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question to be answered from the document.'),
});
export type AnswerQuestionsFromDocumentInput = z.infer<typeof AnswerQuestionsFromDocumentInputSchema>;

const AnswerQuestionsFromDocumentOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, extracted from the document.'),
  sources: z.array(z.string()).describe('The sources in the document that support the answer.'),
});
export type AnswerQuestionsFromDocumentOutput = z.infer<typeof AnswerQuestionsFromDocumentOutputSchema>;

export async function answerQuestionsFromDocument(input: AnswerQuestionsFromDocumentInput): Promise<AnswerQuestionsFromDocumentOutput> {
  return answerQuestionsFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsFromDocumentPrompt',
  input: {schema: AnswerQuestionsFromDocumentInputSchema},
  output: {schema: AnswerQuestionsFromDocumentOutputSchema},
  prompt: `You are an expert at answering questions based on uploaded documents.

  You will be given a document and a question. You will answer the question based on the document, and provide references to the source material.

  Document: {{media url=documentDataUri}}
  Question: {{{question}}}
  Answer:
  `,
});

const answerQuestionsFromDocumentFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFromDocumentFlow',
    inputSchema: AnswerQuestionsFromDocumentInputSchema,
    outputSchema: AnswerQuestionsFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

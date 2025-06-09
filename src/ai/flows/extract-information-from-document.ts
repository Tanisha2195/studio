// src/ai/flows/extract-information-from-document.ts
'use server';
/**
 * @fileOverview Extracts information related to a specific keyword from a document.
 *
 * - extractInformation - A function that handles the information extraction process.
 * - ExtractInformationInput - The input type for the extractInformation function.
 * - ExtractInformationOutput - The return type for the extractInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractInformationInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to extract information from.'),
  keyword: z.string().describe('The keyword to search for in the document.'),
});
export type ExtractInformationInput = z.infer<typeof ExtractInformationInputSchema>;

const ExtractInformationOutputSchema = z.object({
  relevantInformation: z
    .string()
    .describe('The information from the document related to the keyword.'),
});
export type ExtractInformationOutput = z.infer<typeof ExtractInformationOutputSchema>;

export async function extractInformation(input: ExtractInformationInput): Promise<ExtractInformationOutput> {
  return extractInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractInformationPrompt',
  input: {schema: ExtractInformationInputSchema},
  output: {schema: ExtractInformationOutputSchema},
  prompt: `You are a helpful assistant designed to extract information from a document based on a user-provided keyword.

  Document Text: {{{documentText}}}
  Keyword: {{{keyword}}}

  Please extract all information from the document that is relevant to the keyword.  Present the information in a clear and concise manner.`,
});

const extractInformationFlow = ai.defineFlow(
  {
    name: 'extractInformationFlow',
    inputSchema: ExtractInformationInputSchema,
    outputSchema: ExtractInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

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
    .optional()
    .describe('The text content of the document to extract information from (primarily for .txt files).'),
  documentDataUri: z
    .string()
    .optional()
    .describe(
      "A document (e.g., PDF, DOCX), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Used if documentText is not provided."
    ),
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

{{#if documentText}}
Document Text:
{{{documentText}}}
{{else if documentDataUri}}
Document (analyze content from media URI):
{{media url=documentDataUri}}
{{/if}}

Keyword: {{{keyword}}}

Please extract all information from the document that is relevant to the keyword. Present the information in a clear and concise manner. If the document is not text-based, analyze its content to find information related to the keyword.`,
});

const extractInformationFlow = ai.defineFlow(
  {
    name: 'extractInformationFlow',
    inputSchema: ExtractInformationInputSchema,
    outputSchema: ExtractInformationOutputSchema,
  },
  async input => {
    if (!input.documentText && !input.documentDataUri) {
      throw new Error('Either documentText or documentDataUri must be provided for extraction.');
    }
    const {output} = await prompt(input);
    return output!;
  }
);

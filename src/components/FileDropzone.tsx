
"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileDropzoneProps {
  onFileProcessed: (file: File, dataUri: string, textContent: string | null) => void;
  processing: boolean;
  displayedFileName?: string | null;
}

export function FileDropzone({ onFileProcessed, processing, displayedFileName }: FileDropzoneProps) {
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
          toast({
            title: 'Invalid File Type',
            description: 'Please upload a PDF, DOCX, or TXT file.',
            variant: 'destructive',
          });
          return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
          const dataUri = reader.result as string;
          if (file.type === 'text/plain') {
            const textReader = new FileReader();
            textReader.onload = (e) => {
              onFileProcessed(file, dataUri, e.target?.result as string);
            };
            textReader.onerror = () => {
                toast({ title: 'File Read Error', description: 'Could not read the text content of the file.', variant: 'destructive' });
            };
            textReader.readAsText(file);
          } else {
            onFileProcessed(file, dataUri, null); // No text content for PDF/DOCX initially
          }
        };
        reader.onerror = () => {
            toast({ title: 'File Read Error', description: 'Could not read the file.', variant: 'destructive' });
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileProcessed, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: false,
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Upload Your Document</CardTitle>
        <CardDescription>Drag & drop a PDF, DOCX, or TXT file, or click to select.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}
            ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} disabled={processing} />
          {processing ? (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Processing {displayedFileName ? `"${displayedFileName}"` : 'file'}...
              </p>
            </>
          ) : displayedFileName ? (
            <>
              <FileText className="h-12 w-12 text-primary" />
              <p className="mt-4 text-sm text-foreground text-center">
                Uploaded: <span className="font-semibold">{displayedFileName}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Drop another file or click to replace. (PDF, DOCX, TXT)
              </p>
            </>
          ) : (
            <>
              <UploadCloud className="h-12 w-12 text-muted-foreground group-hover:text-primary" />
              <p className="mt-4 text-sm text-muted-foreground text-center">
                {isDragActive ? 'Drop the file here...' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1 text-center">(PDF, DOCX, TXT)</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

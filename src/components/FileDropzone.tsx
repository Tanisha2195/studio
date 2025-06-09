"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface FileDropzoneProps {
  onFileProcessed: (file: File, dataUri: string, textContent: string | null) => void;
  processing: boolean;
}

export function FileDropzone({ onFileProcessed, processing }: FileDropzoneProps) {
  const [pastedText, setPastedText] = useState('');
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
            textReader.readAsText(file);
          } else {
            onFileProcessed(file, dataUri, null); // No text content for PDF/DOCX initially
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileProcessed, toast]
  );

  const handlePasteText = () => {
    if (pastedText.trim()) {
      const pseudoFile = new File([pastedText], "pasted_content.txt", { type: "text/plain" });
      const dataUri = `data:text/plain;base64,${btoa(pastedText)}`;
      onFileProcessed(pseudoFile, dataUri, pastedText);
      setPastedText('');
       toast({
        title: 'Text Content Processed',
        description: 'Pasted text is ready for analysis.',
      });
    } else {
      toast({
        title: 'No Text Pasted',
        description: 'Please paste some text content to process.',
        variant: 'destructive',
      });
    }
  };

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
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          ) : (
            <UploadCloud className="h-12 w-12 text-muted-foreground group-hover:text-primary" />
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            {isDragActive ? 'Drop the file here...' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">(PDF, DOCX, TXT)</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or paste text content
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paste-text" className="font-headline">Paste Document Text</Label>
          <Textarea
            id="paste-text"
            placeholder="Paste text here for extraction and detailed follow-up questions..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={5}
            className="shadow-sm focus:ring-primary focus:border-primary"
            disabled={processing}
          />
           <Button onClick={handlePasteText} disabled={processing || !pastedText.trim()} className="w-full mt-2">
            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            Process Pasted Text
          </Button>
        </div>
        
      </CardContent>
    </Card>
  );
}

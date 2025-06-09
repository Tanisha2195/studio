
"use client";

import React, { useState, useEffect } from 'react';
import { QuestaLogo } from '@/components/QuestaLogo';
import { FileDropzone } from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Send, Lightbulb, FileText, AlertTriangle, Sparkles, MessageSquare } from 'lucide-react'; // FileText is already here
import { useToast } from "@/hooks/use-toast";

import { extractInformation, type ExtractInformationInput } from '@/ai/flows/extract-information-from-document';
import { answerQuestionsFromDocument, type AnswerQuestionsFromDocumentInput } from '@/ai/flows/answer-questions-from-document';
import { followUpQuestionUnderstanding, type FollowUpQuestionUnderstandingInput } from '@/ai/flows/follow-up-question-understanding';

type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  sources?: string[];
};

export default function QuestaPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentDataUri, setDocumentDataUri] = useState<string | null>(null);
  const [documentTextContent, setDocumentTextContent] = useState<string | null>(null);

  const [keyword, setKeyword] = useState<string>('');
  const [extractedInfo, setExtractedInfo] = useState<string | null>(null);
  const [isLoadingExtraction, setIsLoadingExtraction] = useState<boolean>(false);

  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState<boolean>(false);
  
  const [previousQuestion, setPreviousQuestion] = useState<string | null>(null);
  const [previousAnswer, setPreviousAnswer] = useState<string | null>(null);

  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false); // This state could be used to drive the 'processing' prop more accurately

  const { toast } = useToast();

  const handleFileProcessed = (file: File, dataUri: string, textContent: string | null) => {
    setUploadedFile(file);
    setDocumentDataUri(dataUri);
    setDocumentTextContent(textContent);
    // Reset states related to previous document
    setKeyword('');
    setExtractedInfo(null);
    setCurrentQuestion('');
    setConversation([]);
    setPreviousQuestion(null);
    setPreviousAnswer(null);
    toast({
      title: "Document Ready",
      description: `${file.name} has been processed and is ready for analysis.`,
    });
  };

  const handleExtractKeyword = async () => {
    if (!documentTextContent) {
      toast({
        title: "Text Content Required",
        description: "Keyword extraction requires text content. Please upload a .txt file.",
        variant: "destructive",
      });
      return;
    }
    if (!keyword.trim()) {
      toast({
        title: "Keyword Missing",
        description: "Please enter a keyword to extract information.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingExtraction(true);
    // setIsProcessingFile(true); // Potentially set a general processing state
    setExtractedInfo(null);
    try {
      const input: ExtractInformationInput = { documentText: documentTextContent, keyword };
      const result = await extractInformation(input);
      setExtractedInfo(result.relevantInformation);
      toast({
        title: "Extraction Successful",
        description: `Information related to "${keyword}" extracted.`,
      });
    } catch (error) {
      console.error("Error extracting information:", error);
      toast({
        title: "Extraction Failed",
        description: "Could not extract information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExtraction(false);
      // setIsProcessingFile(false); // Clear general processing state
    }
  };

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim()) {
      toast({
        title: "Question Missing",
        description: "Please enter a question to ask.",
        variant: "destructive",
      });
      return;
    }
    
    const userMessage: Message = { id: Date.now().toString(), type: 'user', content: currentQuestion };
    setConversation(prev => [...prev, userMessage]);
    setCurrentQuestion('');
    setIsLoadingAnswer(true);
    // setIsProcessingFile(true); // Potentially set a general processing state

    try {
      if (previousQuestion && previousAnswer && documentTextContent) { // Follow-up question
        const input: FollowUpQuestionUnderstandingInput = {
          document: documentTextContent,
          previousQuestion,
          previousAnswer,
          followUpQuestion: userMessage.content,
        };
        const result = await followUpQuestionUnderstanding(input);
        const aiMessage: Message = { id: Date.now().toString() + '_ai', type: 'ai', content: result.answer };
        setConversation(prev => [...prev, aiMessage]);
        setPreviousQuestion(userMessage.content);
        setPreviousAnswer(result.answer);
      } else if (documentDataUri) { // Initial question
         if (!documentTextContent && (previousQuestion || previousAnswer)) {
          toast({
            title: "Text Content Needed for Follow-up",
            description: "Detailed follow-ups require document text. Please upload a TXT file for best results with follow-up questions.",
            variant: "default",
          });
        }
        const input: AnswerQuestionsFromDocumentInput = { documentDataUri, question: userMessage.content };
        const result = await answerQuestionsFromDocument(input);
        const aiMessage: Message = { id: Date.now().toString() + '_ai', type: 'ai', content: result.answer, sources: result.sources };
        setConversation(prev => [...prev, aiMessage]);
        setPreviousQuestion(userMessage.content);
        setPreviousAnswer(result.answer);

      } else {
         toast({
          title: "No Document",
          description: "Please upload a document first.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing question:", error);
      const errorMessage: Message = { id: Date.now().toString() + '_err', type: 'ai', content: "Sorry, I couldn't process that question. Please try again." };
      setConversation(prev => [...prev, errorMessage]);
      toast({
        title: "Error Answering Question",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAnswer(false);
      // setIsProcessingFile(false); // Clear general processing state
    }
  };

  // Determine a general processing state for the FileDropzone
  // This could be true if either extraction or Q&A is happening.
  const isAppProcessing = isLoadingExtraction || isLoadingAnswer;


  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-secondary/30">
      <header className="w-full max-w-6xl mb-8">
        <QuestaLogo />
        <p className="text-muted-foreground mt-1 font-body">Unlock insights from your documents with AI-powered analysis.</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <FileDropzone
            onFileProcessed={handleFileProcessed}
            processing={isAppProcessing} // Use combined processing state
            displayedFileName={uploadedFile?.name || null}
          />

          {uploadedFile && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" />Keyword Extraction</CardTitle>
                <CardDescription>Find specific information by keyword. For best results, upload a .txt file.</CardDescription>
                {!documentTextContent && (
                  <Alert variant="default" className="mt-2 bg-primary/5 border-primary/20">
                     <Lightbulb className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-headline text-primary">Text Content Recommended</AlertTitle>
                    <AlertDescription className="text-primary/80">
                      Keyword extraction works best with .txt files. For PDF/DOCX, this feature might be limited.
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter keyword (e.g., 'budget')"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    disabled={!documentTextContent || isLoadingExtraction}
                    className="shadow-sm"
                  />
                  <Button onClick={handleExtractKeyword} disabled={!documentTextContent || isLoadingExtraction || !keyword.trim()} className="whitespace-nowrap">
                    {isLoadingExtraction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Extract
                  </Button>
                </div>
                {extractedInfo && (
                  <Card className="bg-secondary/50 p-4 rounded-md shadow-inner">
                    <CardHeader className="p-0 pb-2">
                       <CardTitle className="font-headline text-base text-primary">Extracted Information for "{keyword}"</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-40">
                        <p className="text-sm whitespace-pre-wrap font-body">{extractedInfo}</p>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="shadow-lg lg:min-h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary" />Ask Questa</CardTitle>
            <CardDescription>Interact with your document content.</CardDescription>
            {!uploadedFile && (
                <Alert variant="default" className="mt-2 bg-accent/20 border-accent/40">
                    <AlertTriangle className="h-4 w-4 text-accent-foreground" />
                    <AlertTitle className="font-headline">Upload a Document</AlertTitle>
                    <AlertDescription>
                    Please upload a document to start asking questions.
                    </AlertDescription>
                </Alert>
            )}
          </CardHeader>
          <CardContent className="flex-grow flex flex-col space-y-4 overflow-hidden">
            <ScrollArea className="flex-grow pr-4 -mr-4 mb-4 h-64 lg:h-auto">
              <div className="space-y-4">
                {conversation.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl shadow ${
                        msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <p className="text-sm font-body whitespace-pre-wrap">{msg.content}</p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-secondary-foreground/20">
                          <p className="text-xs font-bold font-headline">Sources:</p>
                          <ul className="list-disc list-inside text-xs">
                            {msg.sources.map((source, i) => <li key={i}>{source}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoadingAnswer && (
                   <div className="flex justify-start">
                     <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <p className="text-sm font-body">Questa is thinking...</p>
                     </div>
                   </div>
                )}
              </div>
            </ScrollArea>
            <Separator />
            <div className="flex space-x-2 pt-2">
              <Input
                type="text"
                placeholder={uploadedFile ? "Ask a question about your document..." : "Upload a document to ask questions"}
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoadingAnswer && currentQuestion.trim() && handleAskQuestion()}
                disabled={!uploadedFile || isLoadingAnswer}
                className="shadow-sm"
              />
              <Button onClick={handleAskQuestion} disabled={!uploadedFile || isLoadingAnswer || !currentQuestion.trim()}>
                {isLoadingAnswer ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Ask
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="w-full max-w-6xl mt-12 text-center text-muted-foreground text-sm font-body">
        <p>&copy; {new Date().getFullYear()} Questa. All rights reserved.</p>
        <p>Powered by GenAI</p>
      </footer>
    </div>
  );
}



"use client";

import type { Metadata } from 'next';
import React, { useState, useEffect } from 'react';
import { QuestaLogo } from '@/components/QuestaLogo';
import { FileDropzone } from '@/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Send, Lightbulb, FileText as FileTextIcon, AlertTriangle, Sparkles, MessageSquare, BookOpen, Search as SearchIcon, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

import { extractInformation, type ExtractInformationInput } from '@/ai/flows/extract-information-from-document';
import { answerQuestionsFromDocument, type AnswerQuestionsFromDocumentInput } from '@/ai/flows/answer-questions-from-document';
import { followUpQuestionUnderstanding, type FollowUpQuestionUnderstandingInput } from '@/ai/flows/follow-up-question-understanding';

// export const metadata: Metadata = { // Metadata for specific pages should be in the page itself
//   title: 'Questa App - Document Analysis',
//   description: 'Upload, extract keywords, and ask questions about your documents using AI.',
// };


type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  sources?: string[];
};

interface HistoryMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  sources?: string[];
}

interface AppHistoryEntry {
  id: string;
  date: string;
  isoDate: string;
  fileName: string;
  fileType: string;
  keywordSearch?: {
    keyword: string;
    extractedInfo: string;
  };
  questionsAndAnswers?: HistoryMessage[];
}


export default function QuestaAppPage() {
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

  const [isSavingSession, setIsSavingSession] = useState<boolean>(false);


  const { toast } = useToast();

  const resetSessionState = () => {
    setUploadedFile(null);
    setDocumentDataUri(null);
    setDocumentTextContent(null);
    setKeyword('');
    setExtractedInfo(null);
    setCurrentQuestion('');
    setConversation([]);
    setPreviousQuestion(null);
    setPreviousAnswer(null);
  };

  const handleFileProcessed = (file: File, dataUri: string, textContent: string | null) => {
    resetSessionState(); // Clear previous session before starting a new one
    setUploadedFile(file);
    setDocumentDataUri(dataUri);
    setDocumentTextContent(textContent);
    toast({
      title: "Document Ready",
      description: `${file.name} has been processed and is ready for analysis.`,
    });
  };

  const handleExtractKeyword = async () => {
    if (!documentTextContent && !documentDataUri) { 
       toast({
        title: "No Document Loaded",
        description: "Please upload a document first to extract keywords.",
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
    setExtractedInfo(null);
    try {
      const input: ExtractInformationInput = {
        keyword,
        ...(documentTextContent && (uploadedFile?.type === 'text/plain' || uploadedFile?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') 
            ? { documentText: documentTextContent } 
            : { documentDataUri: documentDataUri! })
      };
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

    try {
      if (previousQuestion && previousAnswer && (documentTextContent || documentDataUri)) { 
        const followUpInput: FollowUpQuestionUnderstandingInput = {
           document: documentTextContent || `Document context is based on the uploaded file: ${uploadedFile?.name}. Previous interactions are key. Analyze the provided document context.`,
          previousQuestion,
          previousAnswer,
          followUpQuestion: userMessage.content,
        };
        const result = await followUpQuestionUnderstanding(followUpInput);
        const aiMessage: Message = { id: Date.now().toString() + '_ai', type: 'ai', content: result.answer };
        setConversation(prev => [...prev, aiMessage]);
        setPreviousQuestion(userMessage.content);
        setPreviousAnswer(result.answer);

      } else if (documentDataUri || documentTextContent) { 
          const input: AnswerQuestionsFromDocumentInput = { 
            question: userMessage.content,
            ...(documentTextContent && (uploadedFile?.type === 'text/plain' || uploadedFile?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') 
                ? { documentText: documentTextContent } 
                : { documentDataUri: documentDataUri! })
          };
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
    }
  };

  const handleSaveSession = () => {
    if (!uploadedFile) {
      toast({
        title: "No Active Session",
        description: "Upload a document and interact with it to save a session.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingSession(true);

    const newHistoryEntry: AppHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      isoDate: new Date().toISOString(),
      fileName: uploadedFile.name,
      fileType: uploadedFile.type,
      ...(keyword && extractedInfo && { keywordSearch: { keyword, extractedInfo } }),
      ...(conversation.length > 0 && { questionsAndAnswers: conversation }),
    };

    try {
      const existingHistoryString = localStorage.getItem('questaAppHistory');
      const existingHistory: AppHistoryEntry[] = existingHistoryString ? JSON.parse(existingHistoryString) : [];
      const updatedHistory = [newHistoryEntry, ...existingHistory]; // Add new entry to the beginning
      localStorage.setItem('questaAppHistory', JSON.stringify(updatedHistory));
      
      resetSessionState();
      toast({
        title: "Session Saved",
        description: "Your interaction has been saved to history.",
      });
    } catch (error) {
      console.error("Error saving session to localStorage:", error);
      toast({
        title: "Saving Failed",
        description: "Could not save your session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingSession(false);
    }
  };

  const isAppProcessing = isLoadingExtraction || isLoadingAnswer || isSavingSession;


  return (
    <div className="relative flex flex-col items-center p-4 md:p-8 bg-gradient-to-br from-background to-secondary/30 min-h-[calc(100vh-80px)]">
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <BookOpen className="absolute top-[2%] left-[5%] h-9 w-9 text-primary opacity-20 transform -rotate-15 filter blur-xs" />
        <FileTextIcon className="absolute top-[8%] left-[15%] h-10 w-10 text-primary opacity-20 transform rotate-10 filter blur-none" />
        <SearchIcon className="absolute top-[12%] left-[2%] h-8 w-8 text-primary opacity-25 transform rotate-25 filter blur-xs" />
        
        <BookOpen className="absolute top-[8%] left-[5%] h-10 w-10 text-primary opacity-20 transform -rotate-12 filter blur-none" />
        <FileTextIcon className="absolute top-[15%] right-[8%] h-12 w-12 text-primary opacity-20 transform rotate-6 filter blur-xs" />
        <SearchIcon className="absolute top-[30%] left-[12%] h-8 w-8 text-primary opacity-25 transform rotate-12 filter blur-none" />
        <BookOpen className="absolute bottom-[10%] right-[5%] h-10 w-10 text-primary opacity-20 transform rotate-3 filter blur-xs" />
        <FileTextIcon className="absolute bottom-[20%] left-[8%] h-12 w-12 text-primary opacity-20 transform -rotate-3 filter blur-none" />
        
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[50%] right-[10%] text-primary opacity-20 transform -rotate-45 filter blur-xs">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
         <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-[5%] left-[20%] text-primary opacity-20 transform rotate-10 filter blur-none">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>

        <SearchIcon className="absolute top-[65%] left-[2%] h-10 w-10 text-primary opacity-20 transform rotate-20 filter blur-none" />
        <BookOpen className="absolute bottom-[30%] right-[15%] h-8 w-8 text-primary opacity-25 transform -rotate-10 filter blur-xs" />
        <FileTextIcon className="absolute top-[5%] right-[3%] h-10 w-10 text-primary opacity-20 transform rotate-15 filter blur-none" />
        <SearchIcon className="absolute bottom-[8%] left-[45%] h-10 w-10 text-primary opacity-20 transform rotate-5 filter blur-xs" />
        <BookOpen className="absolute top-[40%] left-[48%] h-8 w-8 text-primary opacity-15 transform rotate-0 filter blur-none" />
        <FileTextIcon className="absolute top-[75%] right-[6%] h-12 w-12 text-primary opacity-25 transform -rotate-8 filter blur-xs" />

        <SearchIcon className="absolute top-[2%] left-[30%] h-7 w-7 text-primary opacity-15 transform rotate-30 filter blur-none" />
        <BookOpen className="absolute top-[10%] right-[40%] h-9 w-9 text-primary opacity-20 transform -rotate-20 filter blur-xs" />
        <FileTextIcon className="absolute top-[25%] left-[40%] h-10 w-10 text-primary opacity-20 transform rotate-5 filter blur-none" />
        <SearchIcon className="absolute top-[35%] right-[25%] h-8 w-8 text-primary opacity-25 transform -rotate-15 filter blur-xs" />
        <BookOpen className="absolute top-[55%] left-[15%] h-11 w-11 text-primary opacity-15 transform rotate-25 filter blur-none" />
        <FileTextIcon className="absolute top-[60%] right-[35%] h-9 w-9 text-primary opacity-20 transform -rotate-5 filter blur-xs" />
        <SearchIcon className="absolute top-[70%] left-[25%] h-10 w-10 text-primary opacity-20 transform rotate-10 filter blur-none" />
        <BookOpen className="absolute top-[85%] right-[12%] h-8 w-8 text-primary opacity-25 transform -rotate-30 filter blur-xs" />
        <FileTextIcon className="absolute bottom-[2%] right-[50%] h-11 w-11 text-primary opacity-15 transform rotate-15 filter blur-none" />
        <SearchIcon className="absolute bottom-[15%] left-[30%] h-9 w-9 text-primary opacity-20 transform -rotate-10 filter blur-xs" />
        <BookOpen className="absolute bottom-[25%] right-[20%] h-10 w-10 text-primary opacity-20 transform rotate-8 filter blur-none" />
        <FileTextIcon className="absolute bottom-[35%] left-[40%] h-8 w-8 text-primary opacity-25 transform -rotate-18 filter blur-xs" />
        
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[5%] left-[60%] text-primary opacity-20 transform rotate-50 filter blur-xs">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-[12%] right-[40%] text-primary opacity-20 transform -rotate-25 filter blur-none">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
         <SearchIcon className="absolute top-[45%] right-[45%] h-9 w-9 text-primary opacity-15 transform rotate-35 filter blur-none" />
         <BookOpen className="absolute bottom-[40%] left-[3%] h-10 w-10 text-primary opacity-20 transform -rotate-22 filter blur-xs" />

        <SearchIcon className="absolute top-[42%] left-[47%] h-10 w-10 text-primary opacity-20 transform rotate-5 filter blur-xs" />
        <FileTextIcon className="absolute top-[58%] right-[46%] h-11 w-11 text-primary opacity-20 transform -rotate-12 filter blur-none" />
        <BookOpen className="absolute top-[50%] left-[calc(50%-20px)] h-9 w-9 text-primary opacity-15 transform rotate-18 filter blur-xs" />
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[35%] right-[calc(50%-15px)] text-primary opacity-20 transform rotate-30 filter blur-none">
           <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      </div>

      <header className="w-full max-w-6xl mb-8 z-10">
        <QuestaLogo />
        <p className="text-muted-foreground mt-1 font-body">Unlock insights from your documents with AI-powered analysis.</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">
        <div className="space-y-8">
          <FileDropzone
            onFileProcessed={handleFileProcessed}
            processing={isAppProcessing}
            displayedFileName={uploadedFile?.name || null}
          />

          {uploadedFile && (
            <Card className="shadow-lg bg-card/90 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" />Keyword Extraction</CardTitle>
                <CardDescription>Find specific information by keyword. Works with TXT, PDF, and DOCX files.</CardDescription>
                {uploadedFile && !documentTextContent && uploadedFile.type === 'application/pdf' && (
                  <Alert variant="default" className="mt-2 bg-primary/5 border-primary/20">
                     <Lightbulb className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-headline text-primary">Note on PDF Extraction</AlertTitle>
                    <AlertDescription className="text-primary/80">
                      For PDF files, keyword extraction analyzes the document's content as understood by the AI. For the most precise keyword matches based on exact text, .txt files are recommended.
                    </AlertDescription>
                  </Alert>
                )}
                 {uploadedFile && documentTextContent && uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
                  <Alert variant="default" className="mt-2 bg-primary/5 border-primary/20">
                     <Lightbulb className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-headline text-primary">Note on DOCX Extraction</AlertTitle>
                    <AlertDescription className="text-primary/80">
                      For DOCX files, text content is extracted for keyword analysis. Formatting and complex layouts might affect precision.
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
                    disabled={!uploadedFile || isLoadingExtraction || isSavingSession}
                    className="shadow-sm"
                  />
                  <Button onClick={handleExtractKeyword} disabled={!uploadedFile || isLoadingExtraction || !keyword.trim() || isSavingSession} className="whitespace-nowrap">
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

        <Card className="shadow-lg lg:min-h-[600px] flex flex-col bg-card/90 backdrop-blur-sm border-border/50">
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
                onKeyPress={(e) => e.key === 'Enter' && !isLoadingAnswer && currentQuestion.trim() && !isSavingSession && handleAskQuestion()}
                disabled={!uploadedFile || isLoadingAnswer || isSavingSession}
                className="shadow-sm"
              />
              <Button onClick={handleAskQuestion} disabled={!uploadedFile || isLoadingAnswer || !currentQuestion.trim() || isSavingSession}>
                {isLoadingAnswer ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Ask
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {uploadedFile && (
        <div className="w-full max-w-6xl mt-8 flex justify-center z-10">
          <Button 
            onClick={handleSaveSession} 
            disabled={isSavingSession || isLoadingExtraction || isLoadingAnswer} 
            size="lg"
            variant="default"
            className="shadow-md hover:shadow-lg"
          >
            {isSavingSession ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            End & Save Session
          </Button>
        </div>
      )}

      <footer className="w-full max-w-6xl mt-12 text-center text-muted-foreground text-sm font-body z-10">
        <p>&copy; {new Date().getFullYear()} Questa. All rights reserved.</p>
        <p>Powered by GenAI</p>
      </footer>
    </div>
  );
}


import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, SearchCode, MessageCircleQuestion, BookOpen, FileText as FileTextIcon, Search as SearchIcon } from 'lucide-react';
import { QuestaLogo } from '@/components/QuestaLogo';

export const metadata: Metadata = {
  title: 'Questa - Welcome to Your AI Document Assistant',
  description: 'Welcome to Questa, your AI-powered document analysis tool. Upload, extract, and understand your content.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 md:p-8 text-center bg-gradient-to-br from-background via-secondary/10 to-background">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        {/* Smaller, more distributed background pattern elements */}
        <BookOpen className="absolute top-[2%] left-[5%] h-9 w-9 text-primary opacity-15 transform -rotate-15 filter blur-xs" />
        <FileTextIcon className="absolute top-[1%] left-[2%] h-7 w-7 text-primary opacity-12 transform rotate-5 filter blur-none" />
        <SearchIcon className="absolute top-[3%] left-[10%] h-8 w-8 text-primary opacity-18 transform rotate-20 filter blur-xs" />
        
        <BookOpen className="absolute top-[8%] left-[5%] h-10 w-10 text-primary opacity-15 transform -rotate-12 filter blur-none" />
        <FileTextIcon className="absolute top-[15%] right-[8%] h-12 w-12 text-primary opacity-15 transform rotate-6 filter blur-xs" />
        <SearchIcon className="absolute top-[30%] left-[12%] h-8 w-8 text-primary opacity-20 transform rotate-12 filter blur-none" />
        <BookOpen className="absolute bottom-[10%] right-[5%] h-10 w-10 text-primary opacity-15 transform rotate-3 filter blur-xs" />
        <FileTextIcon className="absolute bottom-[20%] left-[8%] h-12 w-12 text-primary opacity-15 transform -rotate-3 filter blur-none" />
        
        {/* Custom SVG Table Icon - Small */}
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[50%] right-[10%] text-primary opacity-15 transform -rotate-45 filter blur-xs">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
        {/* Custom SVG Document Icon - Small */}
         <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-[5%] left-[20%] text-primary opacity-15 transform rotate-10 filter blur-none">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>

        {/* More elements for wider coverage, especially edges */}
        <SearchIcon className="absolute top-[65%] left-[2%] h-10 w-10 text-primary opacity-15 transform rotate-20 filter blur-none" />
        <BookOpen className="absolute bottom-[30%] right-[15%] h-8 w-8 text-primary opacity-20 transform -rotate-10 filter blur-xs" />
        <FileTextIcon className="absolute top-[5%] right-[3%] h-10 w-10 text-primary opacity-15 transform rotate-15 filter blur-none" />
        <SearchIcon className="absolute bottom-[8%] left-[45%] h-10 w-10 text-primary opacity-15 transform rotate-5 filter blur-xs" />
        <BookOpen className="absolute top-[40%] left-[48%] h-8 w-8 text-primary opacity-10 transform rotate-0 filter blur-none" />
        <FileTextIcon className="absolute top-[75%] right-[6%] h-12 w-12 text-primary opacity-20 transform -rotate-8 filter blur-xs" />

        {/* Adding even more elements for a packed look */}
        <SearchIcon className="absolute top-[2%] left-[30%] h-7 w-7 text-primary opacity-10 transform rotate-30 filter blur-none" />
        <BookOpen className="absolute top-[10%] right-[40%] h-9 w-9 text-primary opacity-12 transform -rotate-20 filter blur-xs" />
        <FileTextIcon className="absolute top-[25%] left-[40%] h-10 w-10 text-primary opacity-15 transform rotate-5 filter blur-none" />
        <SearchIcon className="absolute top-[35%] right-[25%] h-8 w-8 text-primary opacity-18 transform -rotate-15 filter blur-xs" />
        <BookOpen className="absolute top-[55%] left-[15%] h-11 w-11 text-primary opacity-10 transform rotate-25 filter blur-none" />
        <FileTextIcon className="absolute top-[60%] right-[35%] h-9 w-9 text-primary opacity-12 transform -rotate-5 filter blur-xs" />
        <SearchIcon className="absolute top-[70%] left-[25%] h-10 w-10 text-primary opacity-15 transform rotate-10 filter blur-none" />
        <BookOpen className="absolute top-[85%] right-[12%] h-8 w-8 text-primary opacity-18 transform -rotate-30 filter blur-xs" />
        <FileTextIcon className="absolute bottom-[2%] right-[50%] h-11 w-11 text-primary opacity-10 transform rotate-15 filter blur-none" />
        <SearchIcon className="absolute bottom-[15%] left-[30%] h-9 w-9 text-primary opacity-12 transform -rotate-10 filter blur-xs" />
        <BookOpen className="absolute bottom-[25%] right-[20%] h-10 w-10 text-primary opacity-15 transform rotate-8 filter blur-none" />
        <FileTextIcon className="absolute bottom-[35%] left-[40%] h-8 w-8 text-primary opacity-18 transform -rotate-18 filter blur-xs" />
        
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[5%] left-[60%] text-primary opacity-12 transform rotate-50 filter blur-xs">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute bottom-[12%] right-[40%] text-primary opacity-12 transform -rotate-25 filter blur-none">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
         <SearchIcon className="absolute top-[45%] right-[45%] h-9 w-9 text-primary opacity-10 transform rotate-35 filter blur-none" />
         <BookOpen className="absolute bottom-[40%] left-[3%] h-10 w-10 text-primary opacity-12 transform -rotate-22 filter blur-xs" />
         <BookOpen className="absolute top-[2%] left-[5%] h-9 w-9 text-primary opacity-15 transform -rotate-15 filter blur-xs" />
         <FileTextIcon className="absolute top-[1%] left-[2%] h-7 w-7 text-primary opacity-12 transform rotate-5 filter blur-none" />
         <SearchIcon className="absolute top-[3%] left-[10%] h-8 w-8 text-primary opacity-18 transform rotate-20 filter blur-xs" />
      </div>
      
      <main className="w-full max-w-3xl z-10">
        <Card className="w-full shadow-xl bg-card/90 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-4">
            <QuestaLogo iconOnly className="h-16 w-16 text-primary" containerClassName="mb-4 mx-auto" />
            <CardTitle className="text-4xl lg:text-5xl font-headline font-bold text-primary">
              Welcome to Questa
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-muted-foreground mt-3 font-body">
              Your intelligent assistant for document understanding.
              Effortlessly extract key information and get answers from your files.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
              <div className="p-4 bg-secondary/30 rounded-lg border border-secondary/50">
                <SearchCode className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-lg font-headline font-semibold text-foreground">Keyword Extraction</h3>
                <p className="text-sm text-muted-foreground font-body">Pinpoint specific terms and data within your documents instantly.</p>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg border border-secondary/50">
                <MessageCircleQuestion className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-lg font-headline font-semibold text-foreground">Intelligent Q&A</h3>
                <p className="text-sm text-muted-foreground font-body">Ask questions in natural language and get AI-powered answers based on document content.</p>
              </div>
            </div>
            
            <Link href="/app" className="w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto shadow-lg text-base py-6 px-8 group">
                Go to App <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-xs text-muted-foreground pt-4">
              Supports PDF, DOCX, and TXT files.
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="w-full max-w-6xl mt-12 text-center text-muted-foreground text-sm font-body">
        <p>&copy; {new Date().getFullYear()} Questa. Powered by GenAI.</p>
      </footer>
    </div>
  );
}

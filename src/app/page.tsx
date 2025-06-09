
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, SearchCode, MessageCircleQuestion } from 'lucide-react';
import { QuestaLogo } from '@/components/QuestaLogo';

export const metadata: Metadata = {
  title: 'Questa - Welcome to Your AI Document Assistant',
  description: 'Welcome to Questa, your AI-powered document analysis tool. Upload, extract, and understand your content.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 md:p-8 text-center bg-gradient-to-br from-background via-secondary/10 to-background">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        {/* Optional: decorative background elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full filter blur-2xl animate-pulse delay-1000 opacity-50"></div>
      </div>
      
      <main className="w-full max-w-3xl z-10">
        <Card className="w-full shadow-xl bg-card/90 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-4">
            <QuestaLogo iconOnly className="h-16 w-16 text-primary" containerClassName="mx-auto mb-4" />
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

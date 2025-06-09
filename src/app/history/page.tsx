
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListRestart, Trash2, Loader2, FileText, MessageSquare, Search, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface HistoryMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  sources?: string[];
}

interface AppHistoryEntry {
  id: string;
  date: string; // User-friendly date string
  isoDate: string; // ISO date string for sorting
  fileName: string;
  fileType: string;
  keywordSearch?: {
    keyword: string;
    extractedInfo: string;
  };
  questionsAndAnswers?: HistoryMessage[];
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<AppHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedHistory = localStorage.getItem('questaAppHistory');
      if (storedHistory) {
        const parsedHistory: AppHistoryEntry[] = JSON.parse(storedHistory);
        // Sort by isoDate descending (most recent first)
        parsedHistory.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
        setHistoryItems(parsedHistory);
      }
    } catch (error) {
      console.error("Error loading history from localStorage:", error);
      toast({
        title: "Error Loading History",
        description: "Could not load your interaction history.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('questaAppHistory');
      setHistoryItems([]);
      toast({
        title: "History Cleared",
        description: "Your interaction history has been cleared.",
      });
    } catch (error) {
      console.error("Error clearing history from localStorage:", error);
      toast({
        title: "Error Clearing History",
        description: "Could not clear your interaction history.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-160px)]">
      <Card className="max-w-4xl mx-auto shadow-lg bg-card/90 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <ListRestart className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline text-primary">Interaction History</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Review your past document analyses, keyword extractions, and Q&A sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground font-body">Loading history...</p>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground mb-4 font-body">
                No interaction history found.
              </p>
              <p className="text-sm text-muted-foreground mb-6 font-body">
                End a session in the app to save it to your history.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-3">
              <ul className="space-y-6">
                {historyItems.map(item => (
                  <li key={item.id}>
                    <Card className="bg-card hover:shadow-md transition-shadow border-border/70">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl font-headline text-primary flex items-center">
                                <FileText className="mr-2 h-5 w-5 shrink-0" /> {item.fileName}
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground mt-1">
                                {item.date} ({item.fileType})
                                </CardDescription>
                            </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        {item.keywordSearch && (
                          <div className="p-3 bg-secondary/30 rounded-md border border-secondary/50">
                            <h4 className="font-semibold text-secondary-foreground flex items-center mb-1">
                              <Sparkles className="mr-2 h-4 w-4 text-primary" /> Keyword Extraction
                            </h4>
                            <p><strong>Keyword:</strong> {item.keywordSearch.keyword}</p>
                            <ScrollArea className="h-20 mt-1">
                                <p className="text-xs whitespace-pre-wrap font-body">{item.keywordSearch.extractedInfo}</p>
                            </ScrollArea>
                          </div>
                        )}
                        {item.questionsAndAnswers && item.questionsAndAnswers.length > 0 && (
                          <div className="p-3 bg-secondary/30 rounded-md border border-secondary/50">
                            <h4 className="font-semibold text-secondary-foreground flex items-center mb-2">
                              <MessageSquare className="mr-2 h-4 w-4 text-primary" /> Q&A Session ({item.questionsAndAnswers.length} messages)
                            </h4>
                            <ScrollArea className="h-32">
                                <div className="space-y-2">
                                {item.questionsAndAnswers.map(msg => (
                                    <div key={msg.id} className={`flex text-xs ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[90%] p-2 rounded-lg ${
                                            msg.type === 'user' ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                                        }`}>
                                            <span className="font-bold">{msg.type === 'user' ? 'You: ' : 'AI: '}</span>
                                            <span className="whitespace-pre-wrap font-body">{msg.content}</span>
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="mt-1 pt-1 border-t border-muted-foreground/20">
                                                <p className="text-xs font-bold">Sources:</p>
                                                <ul className="list-disc list-inside text-xs">
                                                    {msg.sources.map((source, i) => <li key={i}>{source}</li>)}
                                                </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </ScrollArea>
                          </div>
                        )}
                        {(!item.keywordSearch && (!item.questionsAndAnswers || item.questionsAndAnswers.length === 0)) && (
                            <p className="text-muted-foreground itaic">No specific keyword extraction or Q&A recorded for this session.</p>
                        )}
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
          <div className="mt-8 pt-6 border-t text-center">
            <Button variant="outline" onClick={handleClearHistory} disabled={historyItems.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear All History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

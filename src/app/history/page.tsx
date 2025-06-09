
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListRestart, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Questa - Interaction History',
  description: 'Review your past document interactions and queries with Questa.',
};

export default function HistoryPage() {
  // Placeholder for actual history fetching logic
  const [historyItems, setHistoryItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate fetching history
    // In a real app, this would fetch from localStorage or a backend
    setTimeout(() => {
      // Example items:
      // setHistoryItems([
      //   { id: '1', name: 'Project_Proposal.pdf', date: 'October 21, 2023', lastQuery: 'What is the budget?' },
      //   { id: '2', name: 'Meeting_Notes.docx', date: 'October 22, 2023', lastQuery: 'Key action items?' },
      // ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleClearHistory = () => {
    // Placeholder for actual clear history logic
    alert("Clear history functionality is not yet implemented.");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <ListRestart className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline text-primary">Interaction History</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Review your past document analyses and queries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading history...</p>
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground mb-4">
                No interaction history found.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Start analyzing documents in the app to build your history.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {historyItems.map(item => (
                <li key={item.id} className="p-4 border rounded-md bg-card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-primary font-headline">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">Analyzed on: {item.date}</p>
                  {item.lastQuery && <p className="text-sm mt-1">Last query: "{item.lastQuery}"</p>}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 pt-6 border-t text-center">
             <p className="text-sm text-muted-foreground mb-4">
              (Note: Actual history storage and retrieval is a feature planned for future development.)
            </p>
            <Button variant="outline" onClick={handleClearHistory} disabled>
              <Trash2 className="mr-2 h-4 w-4" /> Clear History (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add necessary imports if not already present at the top
import React from 'react';
import { Loader2 } from 'lucide-react';

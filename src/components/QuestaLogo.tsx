import type { SVGProps } from 'react';
import { Layers } from 'lucide-react';

export function QuestaLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center space-x-2">
      <Layers className="h-8 w-8 text-primary" />
      <h1 className="text-3xl font-headline font-bold text-primary">Questa</h1>
    </div>
  );
}

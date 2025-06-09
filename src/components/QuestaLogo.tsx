
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

interface QuestaLogoProps extends SVGProps<SVGSVGElement> {
  iconOnly?: boolean;
  containerClassName?: string;
}

export function QuestaLogo({ iconOnly = false, containerClassName, className, ...restProps }: QuestaLogoProps) {
  return (
    <div className={cn("flex items-center", !iconOnly ? "space-x-2" : "", containerClassName)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-8 w-8 text-primary", className)} // Default + passed className for SVG
        {...restProps}
      >
        <path d="M11.0078 18.9922C15.421 18.9922 18.9922 15.421 18.9922 11.0078C18.9922 6.59457 15.421 3.02344 11.0078 3.02344C6.59457 3.02344 3.02344 6.59457 3.02344 11.0078C3.02344 15.421 6.59457 18.9922 11.0078 18.9922Z" />
        <line x1="15.5" y1="15.5" x2="20.9766" y2="20.9766" />
      </svg>
      {!iconOnly && (
        <h1 className="text-3xl font-headline font-bold text-primary">Questa</h1>
      )}
    </div>
  );
}

import type { ReactNode } from 'react';

// Single source of the horizontal page gutter (px-4 sm:px-6 lg:px-8) so every
// route lines up identically. `maxW` controls the content width only — the
// gutter is the same for every size. Vertical padding and any extra classes go
// through `className`.
const MAX_W = {
  '7xl': 'max-w-7xl',
  '6xl': 'max-w-6xl',
  '5xl': 'max-w-5xl',
  '4xl': 'max-w-4xl',
  '3xl': 'max-w-3xl',
  '2xl': 'max-w-2xl',
  xl: 'max-w-xl',
  lg: 'max-w-lg',
  md: 'max-w-md',
  sm: 'max-w-sm',
} as const;

export type MaxW = keyof typeof MAX_W;

interface ContainerProps {
  children: ReactNode;
  /** Content max width (gutter is identical regardless). Default '7xl'. */
  maxW?: MaxW;
  className?: string;
}

export default function Container({
  children,
  maxW = '7xl',
  className = '',
}: ContainerProps) {
  return (
    <div
      className={['mx-auto', MAX_W[maxW], 'px-4 sm:px-6 lg:px-8', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

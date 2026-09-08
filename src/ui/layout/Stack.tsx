import React from 'react';

export interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'col',
  gap = 4,
  align = 'stretch',
  justify = 'start',
  className = '',
}) => {
  const dirStyles = direction === 'row' ? 'flex flex-row' : 'flex flex-col';

  const gapStyles = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
  };

  const alignStyles = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyStyles = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      className={`${dirStyles} ${gapStyles[gap]} ${alignStyles[align]} ${justifyStyles[justify]} ${className}`}
    >
      {children}
    </div>
  );
};

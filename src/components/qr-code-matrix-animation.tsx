'use client';

import { useEffect, useState, memo } from 'react';
import { cn } from '@/lib/utils';

const GRID_SIZE = 29; // Number of cells per row/column
const ANIMATION_DURATION = 1500; // Total animation time in ms
const CELL_FADE_IN_DURATION = 500; // Fade in time for each cell

interface QrCodeMatrixAnimationProps {
  onComplete: () => void;
  size: number;
  color: string;
}

// Memoize the cell to prevent re-renders unless its props change
const MemoizedCell = memo(function Cell({
  isFilled,
  color,
}: {
  isFilled: boolean;
  color: string;
}) {
  return (
    <div
      className="transition-colors duration-500"
      style={{
        backgroundColor: isFilled ? color : 'transparent',
        transitionDuration: `${CELL_FADE_IN_DURATION}ms`,
      }}
    />
  );
});

export function QrCodeMatrixAnimation({
  onComplete,
  size,
  color,
}: QrCodeMatrixAnimationProps) {
  const [filledCells, setFilledCells] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const totalCells = GRID_SIZE * GRID_SIZE;
    const allCellIndices = Array.from({ length: totalCells }, (_, i) => i);

    // Shuffle the indices to make the animation appear random
    for (let i = allCellIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCellIndices[i], allCellIndices[j]] = [
        allCellIndices[j],
        allCellIndices[i],
      ];
    }

    const interval = ANIMATION_DURATION / totalCells;
    let filledCount = 0;

    const fillInterval = setInterval(() => {
      setFilledCells((prev) => {
        const nextIndex = allCellIndices[filledCount];
        const newSet = new Set(prev);
        newSet.add(nextIndex);
        return newSet;
      });
      filledCount++;

      if (filledCount >= totalCells) {
        clearInterval(fillInterval);
        setTimeout(() => {
          setIsAnimating(false);
          onComplete();
        }, CELL_FADE_IN_DURATION); // Wait for last cell to fade in
      }
    }, interval);

    return () => clearInterval(fillInterval);
  }, [onComplete]);

  return (
    <div
      className={cn(
        'absolute inset-0 grid p-4 transition-opacity duration-500',
        !isAnimating && 'opacity-0'
      )}
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        width: size,
        height: size,
      }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => (
        <MemoizedCell
          key={index}
          isFilled={filledCells.has(index)}
          color={color}
        />
      ))}
    </div>
  );
}

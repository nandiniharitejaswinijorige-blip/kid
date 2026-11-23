import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  delay: string;
  tx: string;
  rot: string;
  size: number;
}

const COLORS = ['#0284C7', '#10B981', '#F59E0B', '#38BDF8', '#34D399', '#FBBF24'];

export function ConfettiBurst({ triggerKey }: { triggerKey: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (triggerKey <= 0) return;
    const generated: ConfettiPiece[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${8 + Math.random() * 84}%`,
      color: COLORS[i % COLORS.length],
      delay: `${(Math.random() * 0.25).toFixed(2)}s`,
      tx: `${Math.round((Math.random() - 0.5) * 140)}px`,
      rot: `${Math.round(180 + Math.random() * 360)}deg`,
      size: 7 + Math.floor(Math.random() * 6),
    }));
    setPieces(generated);
    const timer = window.setTimeout(() => setPieces([]), 1900);
    return () => window.clearTimeout(timer);
  }, [triggerKey]);

  if (pieces.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={`${triggerKey}-${p.id}`}
          className="animate-confetti-piece absolute top-16 rounded-sm"
          style={
            {
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size * 1.3}px`,
              backgroundColor: p.color,
              animationDelay: p.delay,
              '--tx': p.tx,
              '--rot': p.rot,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

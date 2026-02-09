import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export function SkeletonCard({ className, lines = 3 }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-6", className)}>
      <div className="space-y-4">
        <div className="h-4 w-3/4 rounded bg-muted animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-muted animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
            style={{ width: `${100 - i * 15}%`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="border-b bg-muted/50 p-4">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-4 flex-1 rounded bg-muted animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
            />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 p-4">
            {[1, 2, 3, 4].map((colIndex) => (
              <div
                key={colIndex}
                className="h-4 flex-1 rounded bg-muted animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
                style={{ animationDelay: `${(rowIndex * 4 + colIndex) * 0.05}s` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border bg-card p-6">
          <div className="space-y-3">
            <div
              className="h-3 w-20 rounded bg-muted animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
            <div
              className="h-8 w-24 rounded bg-muted animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]"
              style={{ animationDelay: `${i * 0.1 + 0.05}s` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

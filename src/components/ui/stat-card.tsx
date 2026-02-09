import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

const statCardVariants = cva(
  'relative overflow-hidden rounded-xl p-6 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card border shadow-soft hover:shadow-medium',
        gradient: 'gradient-primary text-primary-foreground shadow-glow',
        glass: 'glass-card',
        outline: 'border-2 border-primary/20 bg-transparent hover:border-primary/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, change, variant, className }: StatCardProps) {
  return (
    <motion.div
      className={cn(statCardVariants({ variant }), className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            "text-sm font-medium",
            variant === 'gradient' ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p className={cn(
              "text-sm",
              change.value >= 0 ? 'text-success' : 'text-destructive',
              variant === 'gradient' && 'text-primary-foreground/90'
            )}>
              {change.value >= 0 ? '+' : ''}{change.value}% {change.label}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "rounded-lg p-3",
            variant === 'gradient' 
              ? 'bg-primary-foreground/20' 
              : 'bg-primary/10'
          )}>
            <Icon className={cn(
              "h-5 w-5",
              variant === 'gradient' ? 'text-primary-foreground' : 'text-primary'
            )} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

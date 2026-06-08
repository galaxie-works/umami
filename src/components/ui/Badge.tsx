import type { HTMLAttributes } from 'react';
import styles from './ui.module.css';
import { cn } from './utils';

export type BadgeTone = 'default' | 'destructive' | 'muted' | 'success' | 'warning';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return <span className={cn(styles.badge, styles[`badge-${tone}`], className)} {...props} />;
}

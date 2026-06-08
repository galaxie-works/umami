import type { HTMLAttributes } from 'react';
import styles from './ui.module.css';
import { cn } from './utils';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn(styles.skeleton, className)} {...props} />;
}

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div aria-live="polite" className={styles.loading} role="status">
      <span className={styles.spinner} />
      <span>{label}</span>
    </div>
  );
}

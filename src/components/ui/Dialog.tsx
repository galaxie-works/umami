'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Button } from './Button';
import styles from './ui.module.css';
import { cn } from './utils';

export interface DialogProps {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  title?: ReactNode;
}

export function Dialog({
  children,
  className,
  description,
  onOpenChange,
  open,
  title,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (open && !node.open) {
      node.showModal();
    }

    if (!open && node.open) {
      node.close();
    }
  }, [open]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleClose = () => onOpenChange?.(false);
    node.addEventListener('close', handleClose);
    return () => node.removeEventListener('close', handleClose);
  }, [onOpenChange]);

  return (
    <dialog className={cn(styles.dialog, className)} ref={ref}>
      <div className={styles.dialogHeader}>
        <div>
          {title ? <h2 className={styles.dialogTitle}>{title}</h2> : null}
          {description ? <p className={styles.dialogDescription}>{description}</p> : null}
        </div>
        <Button
          aria-label="Close"
          onClick={() => onOpenChange?.(false)}
          size="icon"
          variant="ghost"
        >
          x
        </Button>
      </div>
      {children}
    </dialog>
  );
}

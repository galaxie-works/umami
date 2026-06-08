import type { ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';
import styles from './ui.module.css';

export interface EmptyProps {
  action?: ButtonProps & { label: ReactNode };
  description?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
}

export function Empty({ action, description, icon, title }: EmptyProps) {
  return (
    <div className={styles.empty}>
      {icon ? <div className={styles.emptyIcon}>{icon}</div> : null}
      {title ? <div className={styles.emptyTitle}>{title}</div> : null}
      {description ? <div className={styles.emptyDescription}>{description}</div> : null}
      {action ? <Button {...action}>{action.label}</Button> : null}
    </div>
  );
}

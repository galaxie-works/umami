import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './ui.module.css';
import { cn } from './utils';

export type ButtonVariant = 'destructive' | 'ghost' | 'outline' | 'primary' | 'secondary';
export type ButtonSize = 'icon' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  children,
  className,
  icon,
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        styles.button,
        styles[`button-${variant}`],
        styles[`button-${size}`],
        className,
      )}
      type={type}
      {...props}
    >
      {icon ? <span className={styles.buttonIcon}>{icon}</span> : null}
      {children}
    </button>
  );
}

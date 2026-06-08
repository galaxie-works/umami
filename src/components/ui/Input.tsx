import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import styles from './ui.module.css';
import { cn } from './utils';

export interface FieldProps {
  children: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  label?: ReactNode;
}

export function Field({ children, description, error, label }: FieldProps) {
  return (
    <label className={styles.field}>
      {label ? <span className={styles.label}>{label}</span> : null}
      {children}
      {description ? <span className={styles.description}>{description}</span> : null}
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(styles.input, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(styles.input, styles.textarea, className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(styles.input, styles.select, className)} {...props} />;
}

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import styles from './SettingsKit.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export function SettingsCard({
  title,
  description,
  action,
  children,
  id,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section className={styles.card} id={id}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function SettingsField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  );
}

export function SettingsInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={styles.input} {...props} />;
}

export function SettingsSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={styles.select} {...props} />;
}

export function SettingsButton({
  variant = 'secondary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const variantClass =
    variant === 'primary'
      ? styles.buttonPrimary
      : variant === 'ghost'
        ? styles.buttonGhost
        : styles.buttonSecondary;

  return <button className={`${styles.button} ${variantClass}`} type="button" {...props} />;
}

export function SettingsBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: 'success';
}) {
  return (
    <span className={`${styles.badge} ${tone === 'success' ? styles.badgeSuccess : ''}`}>
      {children}
    </span>
  );
}

export const settingsKitStyles = styles;

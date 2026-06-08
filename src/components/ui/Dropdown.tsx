'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';
import { Button } from './Button';
import styles from './ui.module.css';
import { cn } from './utils';

export function Dropdown({ children, label }: { children: ReactNode; label: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={styles.dropdown}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Button aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(value => !value)}>
        {label}
      </Button>
      {open ? (
        <div className={styles.dropdownContent} role="menu">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function DropdownItem({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(styles.dropdownItem, className)}
      role="menuitem"
      type="button"
      {...props}
    />
  );
}

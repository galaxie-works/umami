'use client';

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import styles from './ui.module.css';
import { cn } from './utils';

type TabsContextValue = {
  selected: string;
  setSelected: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
  children,
  className,
  defaultValue,
  onValueChange,
  value,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const selected = value ?? uncontrolledValue;
  const context = useMemo(
    () => ({
      selected,
      setSelected: (nextValue: string) => {
        setUncontrolledValue(nextValue);
        onValueChange?.(nextValue);
      },
    }),
    [onValueChange, selected],
  );

  return (
    <TabsContext.Provider value={context}>
      <div className={cn(styles.tabs, className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(styles.tabsList, className)} role="tablist" {...props} />;
}

export function TabsTrigger({
  className,
  value,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = useContext(TabsContext);
  const selected = context?.selected === value;

  return (
    <button
      aria-selected={selected}
      className={cn(styles.tabsTrigger, selected && styles.tabsTriggerActive, className)}
      onClick={() => context?.setSelected(value)}
      role="tab"
      type="button"
      {...props}
    />
  );
}

export function TabsContent({
  children,
  className,
  value,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = useContext(TabsContext);
  if (context?.selected && context.selected !== value) return null;

  return (
    <div className={cn(styles.tabsContent, className)} role="tabpanel" {...props}>
      {children as ReactNode}
    </div>
  );
}

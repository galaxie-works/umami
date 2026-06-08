'use client';

import { Loading, useTheme } from '@umami/react-zen';
import { Languages, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale, useLoginQuery } from '@/components/hooks';
import { languages } from '@/lib/lang';
import styles from './CosmolyticsAuth.module.css';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const { user, isLoading } = useLoginQuery();
  const { locale, saveLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  if (user || isLoading) {
    return <Loading />;
  }

  return (
    <main className={styles.shell}>
      <section className={styles.cardShell}>
        <LoginForm />
        <div className={styles.authControls} aria-label="Login preferences">
          <label className={styles.languageControl}>
            <Languages size={16} aria-hidden="true" />
            <select
              aria-label="Language"
              onChange={event => saveLocale(event.currentTarget.value)}
              value={locale}
            >
              {Object.entries(languages).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
            className={styles.themeToggle}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            type="button"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </section>
    </main>
  );
}

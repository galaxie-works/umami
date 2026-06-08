'use client';

import { Loading, useTheme } from '@umami/react-zen';
import { ChevronDown, Languages, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale, useLoginQuery } from '@/components/hooks';
import { languages } from '@/lib/lang';
import styles from './CosmolyticsAuth.module.css';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const { user, isLoading } = useLoginQuery();
  const { locale, saveLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
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
          <div className={styles.languageWrapper}>
            <button
              aria-expanded={isLanguageOpen}
              aria-haspopup="listbox"
              aria-label="Language"
              className={styles.languageControl}
              onClick={() => setIsLanguageOpen(value => !value)}
              type="button"
            >
              <Languages size={16} aria-hidden="true" />
              <span>{languages[locale]?.label || 'English'}</span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            {isLanguageOpen && (
              <div className={styles.languageMenu} role="listbox" aria-label="Language">
                {Object.entries(languages).map(([value, { label }]) => (
                  <button
                    aria-selected={value === locale}
                    className={
                      value === locale ? styles.languageOptionActive : styles.languageOption
                    }
                    key={value}
                    onClick={() => {
                      saveLocale(value);
                      setIsLanguageOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
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

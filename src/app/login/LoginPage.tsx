'use client';

import { Loading, useTheme } from '@umami/react-zen';
import { ChevronDown, Languages, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale, useLoginQuery } from '@/components/hooks';
import { Button } from '@/components/ui/button';
import styles from './CosmolyticsAuth.module.css';
import { LoginForm } from './LoginForm';

const loginLanguages = [
  { value: 'pt-BR', label: 'Portugu\u00eas do Brasil' },
  { value: 'en-US', label: 'English' },
  { value: 'es-ES', label: 'Espa\u00f1ol' },
] as const;

export function LoginPage() {
  const { user, isLoading } = useLoginQuery();
  const { locale, saveLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const router = useRouter();
  const activeLanguage = loginLanguages.find(({ value }) => value === locale) || loginLanguages[1];

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
            <Button
              aria-expanded={isLanguageOpen}
              aria-haspopup="listbox"
              aria-label="Language"
              className={styles.languageControl}
              onClick={() => setIsLanguageOpen(value => !value)}
              type="button"
              variant="outline"
            >
              <Languages size={16} aria-hidden="true" />
              <span>{activeLanguage.label}</span>
              <ChevronDown size={14} aria-hidden="true" />
            </Button>
            {isLanguageOpen && (
              <div className={styles.languageMenu} role="listbox" aria-label="Language">
                {loginLanguages.map(({ value, label }) => (
                  <Button
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
                    variant="ghost"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <Button
            aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
            className={styles.themeToggle}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            type="button"
            variant="ghost"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </section>
    </main>
  );
}

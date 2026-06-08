'use client';

import { KeyRound, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/components/hooks';
import { setClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';
import styles from './CosmolyticsAuth.module.css';

type LoginMode = 'password' | 'magic';

export function LoginForm() {
  const router = useRouter();
  const { post, useMutation } = useApi();
  const [mode, setMode] = useState<LoginMode>('password');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');

  const passwordLogin = useMutation({
    mutationFn: (data: Record<string, any>) => post('/auth/login', data),
    onSuccess: data => {
      setClientAuthToken(data.token);
      setUser(data.user);
      router.push('/');
    },
  });

  const magicLink = useMutation({
    mutationFn: (data: Record<string, any>) => post('/auth/magic-link/request', data),
    onSuccess: data => {
      setNotice(
        data.emailConfigured
          ? 'If this account exists, a secure login link is on its way.'
          : 'Magic link email delivery is not configured yet.',
      );
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setNotice('');

    if (mode === 'password') {
      passwordLogin.mutate({ username, password });
    } else {
      magicLink.mutate({ username });
    }
  };

  const error = passwordLogin.error || magicLink.error;
  const isPending = passwordLogin.isPending || magicLink.isPending;

  return (
    <div className={styles.card}>
      <div className={styles.tabs} role="tablist" aria-label="Login method">
        <button
          className={`${styles.tab} ${mode === 'password' ? styles.tabActive : ''}`}
          onClick={() => setMode('password')}
          role="tab"
          type="button"
        >
          Password
        </button>
        <button
          className={`${styles.tab} ${mode === 'magic' ? styles.tabActive : ''}`}
          onClick={() => setMode('magic')}
          role="tab"
          type="button"
        >
          Magic link
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Email or username</span>
          <input
            autoComplete="username"
            className={styles.input}
            data-test="input-username"
            onChange={event => setUsername(event.currentTarget.value)}
            required
            value={username}
          />
        </label>

        {mode === 'password' && (
          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              autoComplete="current-password"
              className={styles.input}
              data-test="input-password"
              onChange={event => setPassword(event.currentTarget.value)}
              required
              type="password"
              value={password}
            />
          </label>
        )}

        {notice && <div className={styles.message}>{notice}</div>}
        {error && <div className={`${styles.message} ${styles.error}`}>{error.message}</div>}

        <button className={styles.button} data-test="button-submit" disabled={isPending}>
          {mode === 'password' ? <KeyRound /> : <Mail />}
          {mode === 'password' ? 'Log in' : 'Send magic link'}
        </button>
      </form>
    </div>
  );
}

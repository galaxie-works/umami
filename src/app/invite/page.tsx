'use client';

import { KeyRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApi } from '@/components/hooks';
import { setClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';
import styles from '@/app/login/CosmolyticsAuth.module.css';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const { post, useMutation } = useApi();
  const [password, setPassword] = useState('');

  const acceptInvite = useMutation({
    mutationFn: (data: Record<string, any>) => post('/auth/invitations/accept', data),
    onSuccess: data => {
      setClientAuthToken(data.token);
      setUser(data.user);
      router.push('/');
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    acceptInvite.mutate({ token, password });
  };

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <img
            alt="Cosmolytics"
            className={styles.logoMark}
            src="/brand/cosmolytics-logo-dark.webp"
          />
          <h1 className={styles.brandName}>Accept your Cosmolytics invite</h1>
          <p className={styles.brandCopy}>Create your password to finish joining the workspace.</p>
        </div>
        <div className={styles.card}>
          {!token && <div className={`${styles.message} ${styles.error}`}>Invite token missing.</div>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>Password</span>
              <input
                autoComplete="new-password"
                className={styles.input}
                minLength={8}
                onChange={event => setPassword(event.currentTarget.value)}
                required
                type="password"
                value={password}
              />
            </label>
            {acceptInvite.error && (
              <div className={`${styles.message} ${styles.error}`}>{acceptInvite.error.message}</div>
            )}
            <button className={styles.button} disabled={!token || acceptInvite.isPending}>
              <KeyRound />
              Accept invitation
            </button>
          </form>
        </div>
      </section>
      <section className={styles.art} aria-hidden="true">
        <div className={styles.artText}>Welcome in. Your analytics workspace is ready.</div>
      </section>
    </main>
  );
}

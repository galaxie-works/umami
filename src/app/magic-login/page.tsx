'use client';

import { LoaderCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useApi } from '@/components/hooks';
import { setClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';
import styles from '@/app/login/CosmolyticsAuth.module.css';

export default function MagicLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const { post } = useApi();
  const [error, setError] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }

    started.current = true;

    if (!token) {
      setError('Magic link token missing.');
      return;
    }

    post('/auth/magic-link/verify', { token })
      .then(data => {
        setClientAuthToken(data.token);
        setUser(data.user);
        router.push('/');
      })
      .catch(error => {
        setError(error.message || 'Magic link is invalid or expired.');
      });
  }, [post, router, token]);

  return (
    <main className={styles.shell}>
      <section className={styles.panel}>
        <div className={styles.brand}>
          <img
            alt="Cosmolytics"
            className={styles.logoMark}
            src="/brand/cosmolytics-logo-dark.webp"
          />
          <h1 className={styles.brandName}>Signing you in</h1>
          <p className={styles.brandCopy}>Cosmolytics is checking your secure magic link.</p>
        </div>
        <div className={styles.card}>
          {error ? (
            <div className={`${styles.message} ${styles.error}`}>{error}</div>
          ) : (
            <div className={styles.message}>
              <LoaderCircle />
              Verifying magic link...
            </div>
          )}
        </div>
      </section>
      <section className={styles.art} aria-hidden="true">
        <div className={styles.artText}>Fast access, same guardrails.</div>
      </section>
    </main>
  );
}
